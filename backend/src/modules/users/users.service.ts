import prisma from '../../config/database';
import bcrypt from 'bcryptjs';
import { NotFoundError, ConflictError, ForbiddenError } from '../../shared/errors/AppError';
import { UserRole } from '@prisma/client';
import { uploadToCloudinary } from '../../config/cloudinary';

// ─── List gym users ───────────────────────────────────────────────────────────
export const listUsers = async (gymId: string, role?: UserRole, page = 1, limit = 20, search?: string) => {
  const skip = (page - 1) * limit;
  const where: any = { gymId };
  if (role) where.role = role;
  if (search) where.OR = [
    { firstName: { contains: search, mode: 'insensitive' } },
    { lastName: { contains: search, mode: 'insensitive' } },
    { email: { contains: search, mode: 'insensitive' } },
  ];

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, email: true, firstName: true, lastName: true, role: true,
        phone: true, avatarUrl: true, isActive: true, lastLoginAt: true, createdAt: true,
        memberProfile: { select: { qrCode: true, joinDate: true } },
        trainerProfile: { select: { specializations: true, commissionRate: true } },
        memberships: { where: { status: 'ACTIVE' }, take: 1, orderBy: { endDate: 'desc' },
          include: { plan: { select: { name: true } } } },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return { users, total };
};

// ─── Create user (staff / trainer / member) ───────────────────────────────────
export const createUser = async (
  gymId: string,
  data: {
    email: string; password: string; firstName: string; lastName: string;
    role: UserRole; phone?: string;
    // member-specific
    dateOfBirth?: string; gender?: string; emergencyContact?: string; medicalNotes?: string;
    // trainer-specific
    bio?: string; specializations?: string[]; certifications?: string[]; commissionRate?: number;
    // inbody initial
    weight?: number; height?: number; bodyFatPercent?: number; muscleMass?: number;
    bmi?: number; bmr?: number; visceralFat?: number;
  },
  avatarBuffer?: Buffer
) => {
  const emailExists = await prisma.user.findUnique({ where: { email: data.email } });
  if (emailExists) throw new ConflictError('Email already registered');

  let avatarUrl: string | undefined;
  if (avatarBuffer) {
    const uploaded = await uploadToCloudinary(avatarBuffer, `gyms/${gymId}/avatars`);
    avatarUrl = uploaded.url;
  }

  const passwordHash = await bcrypt.hash(data.password, 12);

  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        gymId, role: data.role,
        email: data.email.toLowerCase(),
        firstName: data.firstName, lastName: data.lastName,
        phone: data.phone, avatarUrl, passwordHash,
      },
    });

    // Create role-specific profile
    if (data.role === UserRole.MEMBER) {
      await tx.memberProfile.create({
        data: {
          userId: user.id,
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
          gender: data.gender,
          emergencyContact: data.emergencyContact,
          medicalNotes: data.medicalNotes,
        },
      });

      // Log initial InBody if any measurements provided
      const hasInBody = [data.weight, data.height, data.bodyFatPercent].some((v) => v !== undefined);
      if (hasInBody) {
        await tx.inBodyAssessment.create({
          data: {
            gymId, userId: user.id,
            weight: data.weight, height: data.height,
            bodyFatPercent: data.bodyFatPercent, muscleMass: data.muscleMass,
            bmi: data.bmi, bmr: data.bmr, visceralFat: data.visceralFat,
          },
        });
      }
    }

    if (data.role === UserRole.TRAINER) {
      await tx.trainerProfile.create({
        data: {
          userId: user.id, bio: data.bio,
          specializations: data.specializations || [],
          certifications: data.certifications || [],
          commissionRate: data.commissionRate || 0,
        },
      });
    }

    return user;
  });
};

// ─── Get single user ──────────────────────────────────────────────────────────
export const getUser = async (gymId: string, userId: string) => {
  const user = await prisma.user.findFirst({
    where: { id: userId, gymId },
    include: {
      memberProfile: true,
      trainerProfile: true,
      memberships: { include: { plan: true }, orderBy: { createdAt: 'desc' } },
      inbodyRecords: { orderBy: { assessmentDate: 'desc' }, take: 5 },
      assignedTrainees: { include: { member: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } } },
      myTrainer: { include: { trainer: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } } },
    },
  });
  if (!user) throw new NotFoundError('User');
  return user;
};

// ─── Update user ──────────────────────────────────────────────────────────────
export const updateUser = async (gymId: string, userId: string, data: any, avatarBuffer?: Buffer) => {
  const user = await prisma.user.findFirst({ where: { id: userId, gymId } });
  if (!user) throw new NotFoundError('User');

  let avatarUrl = user.avatarUrl ?? undefined;
  if (avatarBuffer) {
    const uploaded = await uploadToCloudinary(avatarBuffer, `gyms/${gymId}/avatars`, userId);
    avatarUrl = uploaded.url;
  }

  return prisma.user.update({
    where: { id: userId },
    data: { firstName: data.firstName, lastName: data.lastName, phone: data.phone, isActive: data.isActive, avatarUrl },
  });
};

// ─── Reset user password ──────────────────────────────────────────────────────
export const resetUserPassword = async (gymId: string, userId: string, newPassword: string) => {
  const user = await prisma.user.findFirst({ where: { id: userId, gymId } });
  if (!user) throw new NotFoundError('User');
  const passwordHash = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });
  // Revoke all refresh tokens
  await prisma.refreshToken.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: new Date() } });
};

// ─── Assign trainer to member ─────────────────────────────────────────────────
export const assignTrainer = async (gymId: string, trainerId: string, memberId: string) => {
  const [trainer, member] = await Promise.all([
    prisma.user.findFirst({ where: { id: trainerId, gymId, role: UserRole.TRAINER } }),
    prisma.user.findFirst({ where: { id: memberId, gymId, role: UserRole.MEMBER } }),
  ]);
  if (!trainer) throw new NotFoundError('Trainer');
  if (!member) throw new NotFoundError('Member');

  return prisma.trainerMember.upsert({
    where: { trainerId_memberId: { trainerId, memberId } },
    create: { trainerId, memberId, isActive: true },
    update: { isActive: true },
  });
};

// ─── Delete user ──────────────────────────────────────────────────────────────
export const deleteUser = async (gymId: string, userId: string) => {
  const user = await prisma.user.findFirst({ where: { id: userId, gymId } });
  if (!user) throw new NotFoundError('User');
  // Soft delete preferred — deactivate
  return prisma.user.update({ where: { id: userId }, data: { isActive: false } });
};
