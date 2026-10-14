import { Request, Response, NextFunction } from 'express';
import * as usersService from './users.service';
import { sendSuccess, sendCreated, sendNoContent, paginate } from '../../shared/utils/response';
import { UserRole } from '@prisma/client';

export const listUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { gymId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const role = req.query.role as UserRole | undefined;
    const search = req.query.search as string | undefined;
    const { users, total } = await usersService.listUsers(gymId, role, page, limit, search);
    sendSuccess(res, users, undefined, 200, paginate(page, limit, total));
  } catch (err) { next(err); }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { gymId } = req.params;
    const avatarFile = (req.files as Record<string, Express.Multer.File[]>)?.avatar?.[0];
    const user = await usersService.createUser(gymId, req.body, avatarFile?.buffer);
    sendCreated(res, user, 'User created successfully');
  } catch (err) { next(err); }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await usersService.getUser(req.params.gymId, req.params.userId);
    sendSuccess(res, user);
  } catch (err) { next(err); }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const avatarFile = (req.files as Record<string, Express.Multer.File[]>)?.avatar?.[0];
    const user = await usersService.updateUser(req.params.gymId, req.params.userId, req.body, avatarFile?.buffer);
    sendSuccess(res, user, 'User updated');
  } catch (err) { next(err); }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await usersService.resetUserPassword(req.params.gymId, req.params.userId, req.body.newPassword);
    sendSuccess(res, null, 'Password reset successfully');
  } catch (err) { next(err); }
};

export const assignTrainer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await usersService.assignTrainer(req.params.gymId, req.body.trainerId, req.params.userId);
    sendSuccess(res, result, 'Trainer assigned');
  } catch (err) { next(err); }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await usersService.deleteUser(req.params.gymId, req.params.userId);
    sendNoContent(res);
  } catch (err) { next(err); }
};
