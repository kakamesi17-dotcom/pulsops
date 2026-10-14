import { Router } from 'express';
import { authenticate, authorize, tenantGuard } from '../../middleware/auth.middleware';
import { UserRole } from '@prisma/client';
import prisma from '../../config/database';
import { sendSuccess, sendCreated, sendNoContent } from '../../shared/utils/response';
import { NotFoundError } from '../../shared/errors/AppError';

const router = Router({ mergeParams: true });
const gymAdminOrSuper = [authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.GYM_ADMIN), tenantGuard];
const superOnly = [authenticate, authorize(UserRole.SUPER_ADMIN)];
const authenticated = [authenticate, tenantGuard];

// ── Platform Plans (Super Admin) ──────────────────────────────────────────────

// GET /api/subscriptions/plans  — all platform tiers
router.get('/platform-plans', authenticate, async (req, res, next) => {
  try {
    const plans = await prisma.platformPlan.findMany({ orderBy: { priceMonthly: 'asc' } });
    sendSuccess(res, plans);
  } catch (err) { next(err); }
});

router.post('/platform-plans', ...superOnly, async (req, res, next) => {
  try {
    const plan = await prisma.platformPlan.create({ data: req.body });
    sendCreated(res, plan, 'Platform plan created');
  } catch (err) { next(err); }
});

router.patch('/platform-plans/:planId', ...superOnly, async (req, res, next) => {
  try {
    const plan = await prisma.platformPlan.update({ where: { id: req.params.planId }, data: req.body });
    sendSuccess(res, plan, 'Plan updated');
  } catch (err) { next(err); }
});

// ── Gym Plans (per-gym membership packages) ───────────────────────────────────

// GET /api/gyms/:gymId/gym-plans
router.get('/gym-plans', ...authenticated, async (req, res, next) => {
  try {
    const plans = await prisma.gymPlan.findMany({
      where: { gymId: req.params.gymId, isActive: true },
      orderBy: { price: 'asc' },
    });
    sendSuccess(res, plans);
  } catch (err) { next(err); }
});

router.post('/gym-plans', ...gymAdminOrSuper, async (req, res, next) => {
  try {
    const plan = await prisma.gymPlan.create({
      data: { gymId: req.params.gymId, ...req.body },
    });
    sendCreated(res, plan, 'Gym plan created');
  } catch (err) { next(err); }
});

router.patch('/gym-plans/:planId', ...gymAdminOrSuper, async (req, res, next) => {
  try {
    const plan = await prisma.gymPlan.update({ where: { id: req.params.planId }, data: req.body });
    sendSuccess(res, plan, 'Plan updated');
  } catch (err) { next(err); }
});

router.delete('/gym-plans/:planId', ...gymAdminOrSuper, async (req, res, next) => {
  try {
    await prisma.gymPlan.update({ where: { id: req.params.planId }, data: { isActive: false } });
    sendNoContent(res);
  } catch (err) { next(err); }
});

// ── Member Memberships ────────────────────────────────────────────────────────

// POST /api/gyms/:gymId/memberships  — assign membership to member
router.post('/memberships', ...gymAdminOrSuper, async (req, res, next) => {
  try {
    const { userId, planId, paidAmount, notes } = req.body;
    const plan = await prisma.gymPlan.findFirst({ where: { id: planId, gymId: req.params.gymId } });
    if (!plan) throw new NotFoundError('Gym plan');

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.durationDays);

    const membership = await prisma.gymMembership.create({
      data: { userId, planId, paidAmount: paidAmount || plan.price, endDate, notes },
      include: { plan: true },
    });
    sendCreated(res, membership, 'Membership assigned');
  } catch (err) { next(err); }
});

// GET /api/gyms/:gymId/memberships/:userId
router.get('/memberships/:userId', ...authenticated, async (req, res, next) => {
  try {
    const memberships = await prisma.gymMembership.findMany({
      where: { userId: req.params.userId },
      orderBy: { createdAt: 'desc' },
      include: { plan: true },
    });
    sendSuccess(res, memberships);
  } catch (err) { next(err); }
});

// ── Trainer Earnings ──────────────────────────────────────────────────────────

// GET /api/gyms/:gymId/earnings  — trainer sees own earnings
router.get('/earnings', authenticate, tenantGuard, async (req, res, next) => {
  try {
    const user = req.user!;
    const where: any = { gymId: req.params.gymId };
    if (user.role === UserRole.TRAINER) where.trainerId = user.userId;

    const earnings = await prisma.trainerEarning.findMany({
      where, orderBy: [{ year: 'desc' }, { month: 'desc' }],
      include: { trainer: { select: { firstName: true, lastName: true } } },
    });
    sendSuccess(res, earnings);
  } catch (err) { next(err); }
});

// POST /api/gyms/:gymId/earnings  — gym admin logs earnings
router.post('/earnings', ...gymAdminOrSuper, async (req, res, next) => {
  try {
    const earning = await prisma.trainerEarning.create({
      data: { gymId: req.params.gymId, ...req.body },
    });
    sendCreated(res, earning);
  } catch (err) { next(err); }
});

// PATCH /api/gyms/:gymId/earnings/:earningId
router.patch('/earnings/:earningId', ...gymAdminOrSuper, async (req, res, next) => {
  try {
    const earning = await prisma.trainerEarning.update({
      where: { id: req.params.earningId }, data: req.body,
    });
    sendSuccess(res, earning, 'Earning updated');
  } catch (err) { next(err); }
});

export default router;
