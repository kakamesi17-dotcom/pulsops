import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, JwtPayload } from '../shared/utils/jwt';
import { UnauthorizedError, ForbiddenError, TenantError } from '../shared/errors/AppError';
import { UserRole } from '@prisma/client';
import prisma from '../config/database';

// Extend Express Request with authenticated user
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

// ─── Authenticate JWT ─────────────────────────────────────────────────────────
export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) throw new UnauthorizedError('No token provided');

    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);

    // Verify user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, isActive: true, gymId: true, role: true },
    });

    if (!user || !user.isActive) throw new UnauthorizedError('User not found or inactive');

    req.user = payload;
    next();
  } catch (err) {
    next(err);
  }
};

// ─── Authorize Roles ──────────────────────────────────────────────────────────
export const authorize = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) return next(new UnauthorizedError());
    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError('Insufficient permissions'));
    }
    next();
  };
};

// ─── Tenant Isolation ─────────────────────────────────────────────────────────
// Ensures :gymId param matches the authenticated user's gym (unless Super Admin)
export const tenantGuard = (req: Request, _res: Response, next: NextFunction): void => {
  if (!req.user) return next(new UnauthorizedError());

  // Super admin can access any gym
  if (req.user.role === UserRole.SUPER_ADMIN) return next();

  const paramGymId = req.params.gymId;
  if (!paramGymId) return next();

  if (req.user.gymId !== paramGymId) {
    return next(new TenantError());
  }
  next();
};

// ─── Optional Auth (public + authenticated routes) ────────────────────────────
export const optionalAuth = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      req.user = verifyAccessToken(token);
    } catch {
      // ignore — unauthenticated access
    }
  }
  next();
};
