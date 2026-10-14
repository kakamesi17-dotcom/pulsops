import { Request, Response, NextFunction } from 'express';
import * as tenantsService from './tenants.service';
import { sendSuccess, sendCreated, sendNoContent, paginate } from '../../shared/utils/response';
import { GymStatus, PlatformTier } from '@prisma/client';

export const listGyms = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string | undefined;
    const { gyms, total } = await tenantsService.listGyms(page, limit, search);
    sendSuccess(res, gyms, undefined, 200, paginate(page, limit, total));
  } catch (err) { next(err); }
};

export const createGym = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const logoFile = (req.files as Record<string, Express.Multer.File[]>)?.logo?.[0];
    const result = await tenantsService.createGym(req.body, logoFile?.buffer);
    sendCreated(res, result, 'Gym created successfully');
  } catch (err) { next(err); }
};

export const getGym = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const gym = await tenantsService.getGym(req.params.gymId);
    sendSuccess(res, gym);
  } catch (err) { next(err); }
};

export const updateGym = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const logoFile = (req.files as Record<string, Express.Multer.File[]>)?.logo?.[0];
    const gym = await tenantsService.updateGym(req.params.gymId, req.body, logoFile?.buffer);
    sendSuccess(res, gym, 'Gym updated');
  } catch (err) { next(err); }
};

export const setGymStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const gym = await tenantsService.setGymStatus(req.params.gymId, req.body.status as GymStatus);
    sendSuccess(res, gym, `Gym status set to ${req.body.status}`);
  } catch (err) { next(err); }
};

export const changeGymTier = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sub = await tenantsService.changeGymTier(req.params.gymId, req.body.tier as PlatformTier, req.body.billingCycle);
    sendSuccess(res, sub, 'Subscription tier updated');
  } catch (err) { next(err); }
};

export const deleteGym = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await tenantsService.deleteGym(req.params.gymId);
    sendNoContent(res);
  } catch (err) { next(err); }
};
