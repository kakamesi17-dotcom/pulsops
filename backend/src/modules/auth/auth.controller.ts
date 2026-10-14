import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';
import { sendSuccess, sendCreated } from '../../shared/utils/response';

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    sendSuccess(res, result, 'Login successful');
  } catch (err) { next(err); }
};

export const refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    const tokens = await authService.refreshAccessToken(refreshToken);
    sendSuccess(res, tokens, 'Token refreshed');
  } catch (err) { next(err); }
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    await authService.logout(refreshToken);
    sendSuccess(res, null, 'Logged out successfully');
  } catch (err) { next(err); }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    await authService.changePassword(req.user!.userId, currentPassword, newPassword);
    sendSuccess(res, null, 'Password changed successfully');
  } catch (err) { next(err); }
};

export const updateFcmToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await authService.updateFcmToken(req.user!.userId, req.body.fcmToken);
    sendSuccess(res, null, 'FCM token updated');
  } catch (err) { next(err); }
};

export const updateWebPush = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await authService.updateWebPushSub(req.user!.userId, req.body.subscription);
    sendSuccess(res, null, 'Web push subscription saved');
  } catch (err) { next(err); }
};

export const me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await import('../../config/database').then(({ default: prisma }) =>
      prisma.user.findUnique({
        where: { id: req.user!.userId },
        select: {
          id: true, email: true, firstName: true, lastName: true, role: true,
          gymId: true, avatarUrl: true, phone: true, language: true, lastLoginAt: true,
          gym: { select: { id: true, name: true, slug: true, logoUrl: true } },
          memberProfile: true,
          trainerProfile: true,
        },
      })
    );
    sendSuccess(res, user);
  } catch (err) { next(err); }
};
