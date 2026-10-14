import { Router } from 'express';
import { authenticate, authorize, tenantGuard } from '../../middleware/auth.middleware';
import { UserRole } from '@prisma/client';
import prisma from '../../config/database';
import QRCode from 'qrcode';
import { sendSuccess, sendCreated } from '../../shared/utils/response';
import { NotFoundError, ForbiddenError } from '../../shared/errors/AppError';

const router = Router({ mergeParams: true });
const gymAdminOrSuper = [authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.GYM_ADMIN, UserRole.RECEPTIONIST), tenantGuard];
const authenticated = [authenticate, tenantGuard];

// POST /api/gyms/:gymId/attendance/checkin  — scan QR code
router.post('/checkin', ...gymAdminOrSuper, async (req, res, next) => {
  try {
    const { gymId } = req.params;
    const { qrCode, method = 'QR' } = req.body;

    // Resolve member by QR code
    const profile = await prisma.memberProfile.findUnique({
      where: { qrCode },
      include: { user: { select: { id: true, firstName: true, lastName: true, gymId: true, isActive: true } } },
    });

    if (!profile || profile.user.gymId !== gymId) throw new NotFoundError('Member QR code');
    if (!profile.user.isActive) throw new ForbiddenError('Member account is inactive');

    // Determine check-in or check-out (alternate)
    const lastRecord = await prisma.attendanceRecord.findFirst({
      where: { gymId, userId: profile.userId },
      orderBy: { scannedAt: 'desc' },
    });
    const type = !lastRecord || lastRecord.type === 'CHECK_OUT' ? 'CHECK_IN' : 'CHECK_OUT';

    const record = await prisma.attendanceRecord.create({
      data: { gymId, userId: profile.userId, type, method },
    });

    sendCreated(res, {
      ...record,
      member: { id: profile.user.id, firstName: profile.user.firstName, lastName: profile.user.lastName },
    }, `${type === 'CHECK_IN' ? 'Check-in' : 'Check-out'} recorded`);
  } catch (err) { next(err); }
});

// POST /api/gyms/:gymId/attendance/manual — manual by userId
router.post('/manual', ...gymAdminOrSuper, async (req, res, next) => {
  try {
    const { gymId } = req.params;
    const { userId, type, notes } = req.body;

    const user = await prisma.user.findFirst({ where: { id: userId, gymId } });
    if (!user) throw new NotFoundError('Member');

    const record = await prisma.attendanceRecord.create({
      data: { gymId, userId, type: type || 'CHECK_IN', method: 'Manual', notes },
    });
    sendCreated(res, record, 'Attendance recorded manually');
  } catch (err) { next(err); }
});

// GET /api/gyms/:gymId/attendance — list (with filters)
router.get('/', ...gymAdminOrSuper, async (req, res, next) => {
  try {
    const { gymId } = req.params;
    const date = req.query.date as string;
    const userId = req.query.userId as string;

    const where: any = { gymId };
    if (userId) where.userId = userId;
    if (date) {
      const d = new Date(date);
      const next = new Date(d);
      next.setDate(d.getDate() + 1);
      where.scannedAt = { gte: d, lt: next };
    }

    const records = await prisma.attendanceRecord.findMany({
      where,
      orderBy: { scannedAt: 'desc' },
      take: 200,
      include: {
        user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
      },
    });
    sendSuccess(res, records);
  } catch (err) { next(err); }
});

// GET /api/gyms/:gymId/attendance/my — member's own attendance
router.get('/my', authenticate, tenantGuard, async (req, res, next) => {
  try {
    const { gymId } = req.params;
    const records = await prisma.attendanceRecord.findMany({
      where: { gymId, userId: req.user!.userId },
      orderBy: { scannedAt: 'desc' },
      take: 100,
    });
    sendSuccess(res, records);
  } catch (err) { next(err); }
});

// GET /api/gyms/:gymId/attendance/qr-generate/:userId
router.get('/qr-generate/:userId', ...gymAdminOrSuper, async (req, res, next) => {
  try {
    const profile = await prisma.memberProfile.findFirst({
      where: { userId: req.params.userId },
    });
    if (!profile) throw new NotFoundError('Member profile');

    const qrDataUrl = await QRCode.toDataURL(profile.qrCode, {
      width: 400,
      margin: 2,
      color: { dark: '#0A0A0A', light: '#FFFFFF' },
    });
    sendSuccess(res, { qrCode: profile.qrCode, qrDataUrl });
  } catch (err) { next(err); }
});

export default router;
