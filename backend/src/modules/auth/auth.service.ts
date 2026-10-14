import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../../config/database';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  getRefreshExpiryDate,
} from '../../shared/utils/jwt';
import {
  UnauthorizedError,
  NotFoundError,
  ConflictError,
  ForbiddenError,
} from '../../shared/errors/AppError';
import { GymStatus } from '@prisma/client';

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    gymId: string | null;
    gymName: string | null;
    gymSlug: string | null;
    avatarUrl: string | null;
  };
}

// ─── Login ─────────────────────────────────────────────────────────────────────
export const login = async (email: string, password: string): Promise<LoginResult> => {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    include: { gym: { select: { id: true, name: true, slug: true, status: true } } },
  });

  if (!user) throw new UnauthorizedError('Invalid email or password');
  if (!user.isActive) throw new ForbiddenError('Account is deactivated');

  // Validate gym tenant status
  if (user.gym) {
    if (user.gym.status === GymStatus.SUSPENDED)
      throw new ForbiddenError('Your gym account has been suspended');
    if (user.gym.status === GymStatus.FROZEN)
      throw new ForbiddenError('Your gym account is currently frozen');
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatch) throw new UnauthorizedError('Invalid email or password');

  // Update last login
  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

  const payload = {
    userId: user.id,
    gymId: user.gymId,
    role: user.role,
    email: user.email,
  };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  // Persist refresh token
  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiresAt: getRefreshExpiryDate(),
    },
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      gymId: user.gymId,
      gymName: user.gym?.name ?? null,
      gymSlug: user.gym?.slug ?? null,
      avatarUrl: user.avatarUrl,
    },
  };
};

// ─── Refresh Token ─────────────────────────────────────────────────────────────
export const refreshAccessToken = async (
  token: string
): Promise<{ accessToken: string; refreshToken: string }> => {
  const payload = verifyRefreshToken(token);

  const stored = await prisma.refreshToken.findUnique({ where: { token } });
  if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
    throw new UnauthorizedError('Invalid or expired refresh token');
  }

  // Revoke old token (rotation)
  await prisma.refreshToken.update({
    where: { token },
    data: { revokedAt: new Date() },
  });

  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user || !user.isActive) throw new UnauthorizedError('User not found or inactive');

  const newPayload = {
    userId: user.id,
    gymId: user.gymId,
    role: user.role,
    email: user.email,
  };

  const newAccessToken = signAccessToken(newPayload);
  const newRefreshToken = signRefreshToken(newPayload);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: newRefreshToken,
      expiresAt: getRefreshExpiryDate(),
    },
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

// ─── Logout ───────────────────────────────────────────────────────────────────
export const logout = async (token: string): Promise<void> => {
  await prisma.refreshToken.updateMany({
    where: { token, revokedAt: null },
    data: { revokedAt: new Date() },
  });
};

// ─── Change Password ──────────────────────────────────────────────────────────
export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new NotFoundError('User');

  const match = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!match) throw new UnauthorizedError('Current password is incorrect');

  const newHash = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash: newHash } });

  // Revoke all refresh tokens
  await prisma.refreshToken.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
};

import { Prisma } from '@prisma/client';

// ─── Update FCM Token ─────────────────────────────────────────────────────────
export const updateFcmToken = async (userId: string, fcmToken: string): Promise<void> => {
  await prisma.user.update({ where: { id: userId }, data: { fcmToken } });
};

// ─── Update Web Push Subscription ────────────────────────────────────────────
export const updateWebPushSub = async (
  userId: string,
  subscription: Record<string, unknown>
): Promise<void> => {
  await prisma.user.update({ where: { id: userId }, data: { webPushSub: subscription as Prisma.InputJsonValue } });
};
