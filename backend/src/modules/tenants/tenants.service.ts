import prisma from '../../config/database';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundError, ConflictError } from '../../shared/errors/AppError';
import { GymStatus, UserRole, PlatformTier } from '@prisma/client';
import { uploadToCloudinary } from '../../config/cloudinary';

export interface CreateGymInput {
  name: string;
  slug: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  timezone?: string;
  planTier?: PlatformTier;
  billingCycle?: 'MONTHLY' | 'ANNUAL';
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  adminPassword: string;
}

// ─── List all gyms ────────────────────────────────────────────────────────────
export const listGyms = async (page = 1, limit = 20, search?: string) => {
  const skip = (page - 1) * limit;
  const where = search
    ? { OR: [{ name: { contains: search, mode: 'insensitive' as const } }, { email: { contains: search, mode: 'insensitive' as const } }] }
    : {};

  const [gyms, total] = await Promise.all([
    prisma.gym.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        subscription: { include: { plan: true } },
        _count: { select: { users: true } },
      },
    }),
    prisma.gym.count({ where }),
  ]);

  return { gyms, total };
};

// ─── Create gym + admin user ──────────────────────────────────────────────────
export const createGym = async (
  data: CreateGymInput,
  logoBuffer?: Buffer
): Promise<{ gym: any; adminUser: any }> => {
  // Check slug uniqueness
  const existing = await prisma.gym.findUnique({ where: { slug: data.slug } });
  if (existing) throw new ConflictError(`Gym slug "${data.slug}" already taken`);

  const emailExists = await prisma.user.findUnique({ where: { email: data.adminEmail } });
  if (emailExists) throw new ConflictError('Admin email already registered');

  let logoUrl: string | undefined;
  if (logoBuffer) {
    const uploaded = await uploadToCloudinary(logoBuffer, `gyms/${data.slug}`, 'logo');
    logoUrl = uploaded.url;
  }

  const passwordHash = await bcrypt.hash(data.adminPassword, 12);

  // Find plan
  const plan = await prisma.platformPlan.findUnique({
    where: { tier: data.planTier || PlatformTier.FREE_TRIAL },
  });

  const endDate = data.billingCycle === 'ANNUAL'
    ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const result = await prisma.$transaction(async (tx) => {
    // Create gym
    const gym = await tx.gym.create({
      data: {
        name: data.name,
        slug: data.slug,
        address: data.address,
        city: data.city,
        country: data.country,
        phone: data.phone,
        email: data.email,
        logoUrl,
        timezone: data.timezone || 'UTC',
      },
    });

    // Create admin user
    const adminUser = await tx.user.create({
      data: {
        gymId: gym.id,
        role: UserRole.GYM_ADMIN,
        email: data.adminEmail.toLowerCase(),
        firstName: data.adminFirstName,
        lastName: data.adminLastName,
        passwordHash,
      },
    });

    // Create subscription if plan exists
    if (plan) {
      await tx.gymSubscription.create({
        data: {
          gymId: gym.id,
          planId: plan.id,
          billingCycle: data.billingCycle || 'MONTHLY',
          startDate: new Date(),
          endDate,
          nextBillingDate: endDate,
          amountPaid: data.billingCycle === 'ANNUAL' ? plan.priceAnnual : plan.priceMonthly,
        },
      });
    }

    return { gym, adminUser };
  });

  return result;
};

// ─── Get gym detail ───────────────────────────────────────────────────────────
export const getGym = async (gymId: string) => {
  const gym = await prisma.gym.findUnique({
    where: { id: gymId },
    include: {
      subscription: { include: { plan: true } },
      _count: { select: { users: true, gymPlans: true, products: true } },
    },
  });
  if (!gym) throw new NotFoundError('Gym');
  return gym;
};

// ─── Update gym ───────────────────────────────────────────────────────────────
export const updateGym = async (gymId: string, data: Partial<CreateGymInput>, logoBuffer?: Buffer) => {
  const gym = await prisma.gym.findUnique({ where: { id: gymId } });
  if (!gym) throw new NotFoundError('Gym');

  let logoUrl = gym.logoUrl ?? undefined;
  if (logoBuffer) {
    const uploaded = await uploadToCloudinary(logoBuffer, `gyms/${gym.slug}`, 'logo');
    logoUrl = uploaded.url;
  }

  return prisma.gym.update({
    where: { id: gymId },
    data: {
      name: data.name,
      address: data.address,
      city: data.city,
      country: data.country,
      phone: data.phone,
      email: data.email,
      timezone: data.timezone,
      logoUrl,
    },
  });
};

// ─── Set gym status (active/suspended/frozen) ─────────────────────────────────
export const setGymStatus = async (gymId: string, status: GymStatus) => {
  const gym = await prisma.gym.findUnique({ where: { id: gymId } });
  if (!gym) throw new NotFoundError('Gym');
  return prisma.gym.update({ where: { id: gymId }, data: { status } });
};

// ─── Change gym subscription tier ────────────────────────────────────────────
export const changeGymTier = async (
  gymId: string,
  tier: PlatformTier,
  billingCycle?: 'MONTHLY' | 'ANNUAL'
) => {
  const plan = await prisma.platformPlan.findUnique({ where: { tier } });
  if (!plan) throw new NotFoundError('Platform plan');

  const endDate = billingCycle === 'ANNUAL'
    ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  return prisma.gymSubscription.upsert({
    where: { gymId },
    create: {
      gymId,
      planId: plan.id,
      billingCycle: billingCycle || 'MONTHLY',
      endDate,
      nextBillingDate: endDate,
      amountPaid: billingCycle === 'ANNUAL' ? plan.priceAnnual : plan.priceMonthly,
    },
    update: {
      planId: plan.id,
      billingCycle: billingCycle || 'MONTHLY',
      endDate,
      nextBillingDate: endDate,
      amountPaid: billingCycle === 'ANNUAL' ? plan.priceAnnual : plan.priceMonthly,
      status: 'ACTIVE',
    },
  });
};

// ─── Delete gym ───────────────────────────────────────────────────────────────
export const deleteGym = async (gymId: string) => {
  const gym = await prisma.gym.findUnique({ where: { id: gymId } });
  if (!gym) throw new NotFoundError('Gym');
  return prisma.gym.delete({ where: { id: gymId } });
};
