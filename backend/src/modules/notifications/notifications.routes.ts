import { Router } from 'express';
import { authenticate, authorize, tenantGuard } from '../../middleware/auth.middleware';
import { UserRole } from '@prisma/client';
import prisma from '../../config/database';
import { sendSuccess, sendCreated } from '../../shared/utils/response';
import { sendMultipleFCM } from '../../config/notifications';
import { sendWebPush } from '../../config/notifications';

const router = Router({ mergeParams: true });
const gymAdminOrSuper = [authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.GYM_ADMIN), tenantGuard];
const authenticated = [authenticate, tenantGuard];

// POST /api/gyms/:gymId/notifications/broadcast
router.post('/broadcast', ...gymAdminOrSuper, async (req, res, next) => {
  try {
    const { gymId } = req.params;
    const { title, body, type = 'ANNOUNCEMENT', imageUrl, deepLink, targetRole } = req.body;

    // Get target users
    const where: any = { gymId, isActive: true };
    if (targetRole) where.role = targetRole;

    const users = await prisma.user.findMany({
      where,
      select: { id: true, fcmToken: true, webPushSub: true },
    });

    // Create notification record
    const notification = await prisma.notification.create({
      data: {
        gymId, title, body, type, imageUrl, deepLink,
        recipients: {
          create: users.map((u) => ({ userId: u.id })),
        },
      },
    });

    // Send FCM push
    const fcmTokens = users.filter((u) => u.fcmToken).map((u) => u.fcmToken!);
    if (fcmTokens.length > 0) {
      await sendMultipleFCM(fcmTokens, title, body, { notificationId: notification.id, deepLink: deepLink || '' });
    }

    // Send Web Push
    for (const user of users) {
      if (user.webPushSub) {
        try {
          await sendWebPush(user.webPushSub as any, title, body, { notificationId: notification.id });
        } catch { /* skip failed */ }
      }
    }

    sendCreated(res, { notification, recipientCount: users.length }, `Broadcast sent to ${users.length} users`);
  } catch (err) { next(err); }
});

// GET /api/gyms/:gymId/notifications — user's notifications
router.get('/', ...authenticated, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.userNotification.findMany({
        where: { userId: req.user!.userId },
        skip, take: limit,
        orderBy: { notification: { sentAt: 'desc' } },
        include: { notification: true },
      }),
      prisma.userNotification.count({ where: { userId: req.user!.userId } }),
    ]);
    sendSuccess(res, items, undefined, 200, { page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
});

// PATCH /api/gyms/:gymId/notifications/:notificationId/read
router.patch('/:notificationId/read', ...authenticated, async (req, res, next) => {
  try {
    await prisma.userNotification.updateMany({
      where: { notificationId: req.params.notificationId, userId: req.user!.userId },
      data: { isRead: true, readAt: new Date() },
    });
    sendSuccess(res, null, 'Notification marked as read');
  } catch (err) { next(err); }
});

// PATCH /api/gyms/:gymId/notifications/read-all
router.patch('/read-all', ...authenticated, async (req, res, next) => {
  try {
    await prisma.userNotification.updateMany({
      where: { userId: req.user!.userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
    sendSuccess(res, null, 'All notifications marked as read');
  } catch (err) { next(err); }
});

// GET /api/gyms/:gymId/notifications/unread-count
router.get('/unread-count', ...authenticated, async (req, res, next) => {
  try {
    const count = await prisma.userNotification.count({
      where: { userId: req.user!.userId, isRead: false },
    });
    sendSuccess(res, { count });
  } catch (err) { next(err); }
});

export default router;
