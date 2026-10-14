import { Router } from 'express';
import { authenticate, authorize, tenantGuard } from '../../middleware/auth.middleware';
import { UserRole } from '@prisma/client';
import prisma from '../../config/database';
import { sendSuccess, sendCreated, sendNoContent, paginate } from '../../shared/utils/response';
import { NotFoundError, ForbiddenError } from '../../shared/errors/AppError';

const router = Router({ mergeParams: true });

const trainerOrAbove = [authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.GYM_ADMIN, UserRole.TRAINER), tenantGuard];
const authenticated = [authenticate, tenantGuard];

// GET /api/gyms/:gymId/nutrition
router.get('/', ...authenticated, async (req, res, next) => {
  try {
    const { gymId } = req.params;
    const user = req.user!;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const where: any = { gymId };
    if (user.role === UserRole.MEMBER) where.assignedToId = user.userId;
    if (user.role === UserRole.TRAINER) where.createdById = user.userId;

    const [plans, total] = await Promise.all([
      prisma.nutritionPlan.findMany({
        where, skip: (page - 1) * limit, take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          assignedTo: { select: { id: true, firstName: true, lastName: true } },
          meals: { orderBy: { order: 'asc' } },
        },
      }),
      prisma.nutritionPlan.count({ where }),
    ]);
    sendSuccess(res, plans, undefined, 200, paginate(page, limit, total));
  } catch (err) { next(err); }
});

// GET /api/gyms/:gymId/nutrition/:planId
router.get('/:planId', ...authenticated, async (req, res, next) => {
  try {
    const plan = await prisma.nutritionPlan.findFirst({
      where: { id: req.params.planId, gymId: req.params.gymId },
      include: { meals: { orderBy: { order: 'asc' } }, assignedTo: { select: { id: true, firstName: true, lastName: true } } },
    });
    if (!plan) throw new NotFoundError('Nutrition plan');
    if (req.user!.role === UserRole.MEMBER && plan.assignedToId !== req.user!.userId)
      throw new ForbiddenError();
    sendSuccess(res, plan);
  } catch (err) { next(err); }
});

// POST /api/gyms/:gymId/nutrition
router.post('/', ...trainerOrAbove, async (req, res, next) => {
  try {
    const { meals, ...planData } = req.body;
    const plan = await prisma.nutritionPlan.create({
      data: {
        gymId: req.params.gymId, createdById: req.user!.userId,
        ...planData,
        meals: meals ? { create: meals } : undefined,
      },
      include: { meals: true },
    });
    sendCreated(res, plan, 'Nutrition plan created');
  } catch (err) { next(err); }
});

// PATCH /api/gyms/:gymId/nutrition/:planId
router.patch('/:planId', ...trainerOrAbove, async (req, res, next) => {
  try {
    const { meals, ...planData } = req.body;
    const plan = await prisma.$transaction(async (tx) => {
      const updated = await tx.nutritionPlan.update({ where: { id: req.params.planId }, data: planData });
      if (meals) {
        await tx.nutritionMeal.deleteMany({ where: { nutritionPlanId: req.params.planId } });
        await tx.nutritionMeal.createMany({ data: meals.map((m: any) => ({ ...m, nutritionPlanId: req.params.planId })) });
      }
      return updated;
    });
    sendSuccess(res, plan, 'Nutrition plan updated');
  } catch (err) { next(err); }
});

// DELETE /api/gyms/:gymId/nutrition/:planId
router.delete('/:planId', ...trainerOrAbove, async (req, res, next) => {
  try {
    await prisma.nutritionPlan.delete({ where: { id: req.params.planId } });
    sendNoContent(res);
  } catch (err) { next(err); }
});

export default router;
