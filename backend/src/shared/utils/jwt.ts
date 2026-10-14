import jwt from 'jsonwebtoken';
import { UserRole } from '@prisma/client';

export interface JwtPayload {
  userId: string;
  gymId: string | null;
  role: UserRole;
  email: string;
}

export const signAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  } as jwt.SignOptions);
};

export const signRefreshToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  } as jwt.SignOptions);
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as JwtPayload;
};

export const getRefreshExpiryDate = (): Date => {
  const days = parseInt(
    (process.env.JWT_REFRESH_EXPIRES_IN || '30d').replace('d', '')
  );
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
};
