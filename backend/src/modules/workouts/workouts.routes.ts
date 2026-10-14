import { Router } from 'express';
import { authenticate, authorize, tenantGuard } from '../../middleware/auth.middleware';
import { UserRole } from '@prisma/client';
import prisma from '../../config/database';
import { sendSuccess, sendCreated, sendNoContent, paginate } from '../../shared/utils/response';
import { NotFoundError, ForbiddenError } from '../../shared/errors/AppError';

const router = Router({ mergeParams: true });

const trainerOrAbove = [authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.GYM_ADMIN, UserRole.TRAINER), tenantGuard];
const authenticated = [authenticate, tenantGuard];

// ── Workout Plans ─────────────────────────────────────────────────────────────

// GET /api/gyms/:gymId/workouts
router.get('/', ...authenticated, async (req, res, next) => {
  try {
    const { gymId } = req.params;
    const user = req.user!;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const where: any = { gymId };
    // Members see only their own
    if (user.role === UserRole.MEMBER) where.assignedToId = user.userId;
    // Trainers see plans they created
    if (user.role === UserRole.TRAINER) where.createdById = user.userId;

    const [plans, total] = await Promise.all([
      prisma.workoutPlan.findMany({
        where, skip: (page - 1) * limit, take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          assignedTo: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
          exercises: { orderBy: [{ dayOfWeek: 'asc' }, { order: 'asc' }] },
        },
      }),
      prisma.workoutPlan.count({ where }),
    ]);

    sendSuccess(res, plans, undefined, 200, paginate(page, limit, total));
  } catch (err) { next(err); }
});

// GET /api/gyms/:gymId/workouts/:planId
router.get('/:planId', ...authenticated, async (req, res, next) => {
  try {
    const plan = await prisma.workoutPlan.findFirst({
      where: { id: req.params.planId, gymId: req.params.gymId },
      include: {
        assignedTo: { select: { id: true, firstName: true, lastName: true } },
        exercises: { orderBy: [{ dayOfWeek: 'asc' }, { order: 'asc' }] },
      },
    });
    if (!plan) throw new NotFoundError('Workout plan');
    const user = req.user!;
    if (user.role === UserRole.MEMBER && plan.assignedToId !== user.userId)
      throw new ForbiddenError();
    sendSuccess(res, plan);
  } catch (err) { next(err); }
});

// POST /api/gyms/:gymId/workouts
router.post('/', ...trainerOrAbove, async (req, res, next) => {
  try {
    const { gymId } = req.params;
    const { exercises, ...planData } = req.body;
    const plan = await prisma.workoutPlan.create({
      data: {
        gymId, createdById: req.user!.userId,
        ...planData,
        exercises: exercises ? { create: exercises } : undefined,
      },
      include: { exercises: true },
    });
    sendCreated(res, plan, 'Workout plan created');
  } catch (err) { next(err); }
});

// PATCH /api/gyms/:gymId/workouts/:planId
router.patch('/:planId', ...trainerOrAbove, async (req, res, next) => {
  try {
    const { exercises, ...planData } = req.body;
    const plan = await prisma.$transaction(async (tx) => {
      const updated = await tx.workoutPlan.update({
        where: { id: req.params.planId },
        data: planData,
      });
      if (exercises) {
        await tx.workoutExercise.deleteMany({ where: { workoutPlanId: req.params.planId } });
        await tx.workoutExercise.createMany({
          data: exercises.map((e: any) => ({ ...e, workoutPlanId: req.params.planId })),
        });
      }
      return updated;
    });
    sendSuccess(res, plan, 'Workout plan updated');
  } catch (err) { next(err); }
});

// DELETE /api/gyms/:gymId/workouts/:planId
router.delete('/:planId', ...trainerOrAbove, async (req, res, next) => {
  try {
    await prisma.workoutPlan.delete({ where: { id: req.params.planId } });
    sendNoContent(res);
  } catch (err) { next(err); }
});

export default router;
