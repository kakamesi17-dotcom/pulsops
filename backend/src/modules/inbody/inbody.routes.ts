import { Router } from 'express';
import { authenticate, authorize, tenantGuard } from '../../middleware/auth.middleware';
import { UserRole } from '@prisma/client';
import prisma from '../../config/database';
import { sendSuccess, sendCreated, paginate } from '../../shared/utils/response';
import { NotFoundError } from '../../shared/errors/AppError';

const router = Router({ mergeParams: true });

const trainerOrAbove = [authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.GYM_ADMIN, UserRole.TRAINER), tenantGuard];
const authenticated = [authenticate, tenantGuard];

// GET /api/gyms/:gymId/members/:memberId/inbody
router.get('/:memberId/inbody', ...authenticated, async (req, res, next) => {
  try {
    const { gymId, memberId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    // Members can only view their own
    if (req.user!.role === UserRole.MEMBER && req.user!.userId !== memberId)
      throw new NotFoundError('InBody records');

    const [records, total] = await Promise.all([
      prisma.inBodyAssessment.findMany({
        where: { gymId, userId: memberId },
        orderBy: { assessmentDate: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.inBodyAssessment.count({ where: { gymId, userId: memberId } }),
    ]);
    sendSuccess(res, records, undefined, 200, paginate(page, limit, total));
  } catch (err) { next(err); }
});

// POST /api/gyms/:gymId/members/:memberId/inbody
router.post('/:memberId/inbody', ...trainerOrAbove, async (req, res, next) => {
  try {
    const { gymId, memberId } = req.params;
    const record = await prisma.inBodyAssessment.create({
      data: { gymId, userId: memberId, assessedById: req.user!.userId, ...req.body },
    });
    sendCreated(res, record, 'InBody assessment logged');
  } catch (err) { next(err); }
});

// PATCH /api/gyms/:gymId/members/:memberId/inbody/:recordId
router.patch('/:memberId/inbody/:recordId', ...trainerOrAbove, async (req, res, next) => {
  try {
    const { gymId, memberId, recordId } = req.params;
    const record = await prisma.inBodyAssessment.updateMany({
      where: { id: recordId, gymId, userId: memberId },
      data: req.body,
    });
    sendSuccess(res, record, 'InBody updated');
  } catch (err) { next(err); }
});

// DELETE /api/gyms/:gymId/members/:memberId/inbody/:recordId
router.delete('/:memberId/inbody/:recordId', ...trainerOrAbove, async (req, res, next) => {
  try {
    await prisma.inBodyAssessment.deleteMany({
      where: { id: req.params.recordId, gymId: req.params.gymId, userId: req.params.memberId },
    });
    res.status(204).send();
  } catch (err) { next(err); }
});

export default router;
