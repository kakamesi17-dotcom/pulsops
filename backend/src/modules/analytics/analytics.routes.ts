import { Router } from 'express';
import { authenticate, authorize, tenantGuard } from '../../middleware/auth.middleware';
import { UserRole } from '@prisma/client';
import prisma from '../../config/database';
import { sendSuccess } from '../../shared/utils/response';

const router = Router({ mergeParams: true });
const gymAdminOrSuper = [authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.GYM_ADMIN), tenantGuard];
const superOnly = [authenticate, authorize(UserRole.SUPER_ADMIN)];

// ─── Gym-level Analytics ──────────────────────────────────────────────────────

// GET /api/gyms/:gymId/analytics/overview
router.get('/overview', ...gymAdminOrSuper, async (req, res, next) => {
  try {
    const { gymId } = req.params;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const [
      totalMembers, activeMembers, totalTrainers, activeSubscriptions,
      monthRevenue, yearRevenue, todayCheckIns, totalOrders, newMembersThisMonth,
    ] = await Promise.all([
      prisma.user.count({ where: { gymId, role: UserRole.MEMBER } }),
      prisma.gymMembership.count({ where: { plan: { gymId }, status: 'ACTIVE' } }),
      prisma.user.count({ where: { gymId, role: UserRole.TRAINER } }),
      prisma.gymMembership.count({ where: { plan: { gymId }, status: 'ACTIVE', endDate: { gte: now } } }),
      prisma.gymMembership.aggregate({
        where: { plan: { gymId }, createdAt: { gte: startOfMonth } },
        _sum: { paidAmount: true },
      }),
      prisma.gymMembership.aggregate({
        where: { plan: { gymId }, createdAt: { gte: startOfYear } },
        _sum: { paidAmount: true },
      }),
      prisma.attendanceRecord.count({
        where: { gymId, type: 'CHECK_IN', scannedAt: { gte: new Date(now.setHours(0, 0, 0, 0)) } },
      }),
      prisma.order.count({ where: { gymId } }),
      prisma.user.count({ where: { gymId, role: UserRole.MEMBER, createdAt: { gte: startOfMonth } } }),
    ]);

    sendSuccess(res, {
      totalMembers, activeMembers, totalTrainers,
      activeSubscriptions, newMembersThisMonth,
      monthRevenue: monthRevenue._sum.paidAmount || 0,
      yearRevenue: yearRevenue._sum.paidAmount || 0,
      todayCheckIns, totalOrders,
    });
  } catch (err) { next(err); }
});

// GET /api/gyms/:gymId/analytics/revenue-chart (last 12 months)
router.get('/revenue-chart', ...gymAdminOrSuper, async (req, res, next) => {
  try {
    const { gymId } = req.params;
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date();
      d.setDate(1);
      d.setMonth(d.getMonth() - i);
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);

      const [membershipRev, orderRev] = await Promise.all([
        prisma.gymMembership.aggregate({
          where: { plan: { gymId }, createdAt: { gte: start, lte: end } },
          _sum: { paidAmount: true },
        }),
        prisma.order.aggregate({
          where: { gymId, status: 'DELIVERED', placedAt: { gte: start, lte: end } },
          _sum: { totalAmount: true },
        }),
      ]);

      months.push({
        month: start.toISOString().slice(0, 7),
        membershipRevenue: Number(membershipRev._sum.paidAmount || 0),
        storeRevenue: Number(orderRev._sum.totalAmount || 0),
        total: Number(membershipRev._sum.paidAmount || 0) + Number(orderRev._sum.totalAmount || 0),
      });
    }
    sendSuccess(res, months);
  } catch (err) { next(err); }
});

// GET /api/gyms/:gymId/analytics/attendance-chart (last 30 days)
router.get('/attendance-chart', ...gymAdminOrSuper, async (req, res, next) => {
  try {
    const { gymId } = req.params;
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const end = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
      const count = await prisma.attendanceRecord.count({
        where: { gymId, type: 'CHECK_IN', scannedAt: { gte: start, lt: end } },
      });
      days.push({ date: start.toISOString().slice(0, 10), checkIns: count });
    }
    sendSuccess(res, days);
  } catch (err) { next(err); }
});

// ─── Super Admin Platform Analytics ──────────────────────────────────────────

// GET /api/analytics/platform
router.get('/platform', ...superOnly, async (req, res, next) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalGyms, activeGyms, suspendedGyms,
      activeSubscriptions, mrrData, arrData, tierBreakdown,
    ] = await Promise.all([
      prisma.gym.count(),
      prisma.gym.count({ where: { status: 'ACTIVE' } }),
      prisma.gym.count({ where: { status: 'SUSPENDED' } }),
      prisma.gymSubscription.count({ where: { status: 'ACTIVE' } }),
      prisma.gymSubscription.aggregate({
        where: { status: 'ACTIVE', billingCycle: 'MONTHLY' },
        _sum: { amountPaid: true },
      }),
      prisma.gymSubscription.aggregate({
        where: { status: 'ACTIVE', billingCycle: 'ANNUAL' },
        _sum: { amountPaid: true },
      }),
      prisma.gymSubscription.groupBy({
        by: ['planId'],
        _count: true,
        where: { status: 'ACTIVE' },
      }),
    ]);

    const mrr = Number(mrrData._sum.amountPaid || 0) + Number(arrData._sum.amountPaid || 0) / 12;
    const arr = mrr * 12;

    sendSuccess(res, {
      totalGyms, activeGyms, suspendedGyms,
      activeSubscriptions, mrr, arr,
      tierBreakdown, revenueForecasts: {
        nextMonth: mrr,
        nextYear: arr,
      },
    });
  } catch (err) { next(err); }
});

export default router;
