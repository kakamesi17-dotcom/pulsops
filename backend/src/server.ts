import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

// Config
import { initFirebase, initWebPush } from './config/notifications';

// Routes
import authRoutes from './modules/auth/auth.routes';
import tenantsRoutes from './modules/tenants/tenants.routes';
import usersRoutes from './modules/users/users.routes';
import inbodyRoutes from './modules/inbody/inbody.routes';
import workoutsRoutes from './modules/workouts/workouts.routes';
import nutritionRoutes from './modules/nutrition/nutrition.routes';
import storeRoutes from './modules/store/store.routes';
import attendanceRoutes from './modules/attendance/attendance.routes';
import notificationsRoutes from './modules/notifications/notifications.routes';
import analyticsRoutes from './modules/analytics/analytics.routes';
import aiRoutes from './modules/ai-assistant/ai.routes';
import subscriptionsRoutes from './modules/subscriptions/subscriptions.routes';

// Middleware
import { errorHandler } from './shared/utils/errorHandler';

// ─── App Setup ────────────────────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 5000;

// ─── Security & Parsing ───────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(','),
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ─── Rate Limiting ────────────────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: { code: 'RATE_LIMITED', message: 'Too many requests' } },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, error: { code: 'RATE_LIMITED', message: 'Too many login attempts' } },
});

app.use(globalLimiter);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'PulsOps API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
const api = '/api';

app.use(`${api}/auth`, authLimiter, authRoutes);
app.use(`${api}/tenants`, tenantsRoutes);
app.use(`${api}/subscriptions`, subscriptionsRoutes);

// Gym-scoped routes
app.use(`${api}/gyms/:gymId/users`, usersRoutes);
app.use(`${api}/gyms/:gymId/members`, inbodyRoutes);
app.use(`${api}/gyms/:gymId/workouts`, workoutsRoutes);
app.use(`${api}/gyms/:gymId/nutrition`, nutritionRoutes);
app.use(`${api}/gyms/:gymId/store`, storeRoutes);
app.use(`${api}/gyms/:gymId/attendance`, attendanceRoutes);
app.use(`${api}/gyms/:gymId/notifications`, notificationsRoutes);
app.use(`${api}/gyms/:gymId/analytics`, analyticsRoutes);
app.use(`${api}/gyms/:gymId/ai`, aiRoutes);
app.use(`${api}/gyms/:gymId`, subscriptionsRoutes); // gym plans & memberships

// Platform analytics
app.use(`${api}/analytics`, analyticsRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Route not found' } });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Initialize Services & Start ─────────────────────────────────────────────
const start = async () => {
  initFirebase();
  initWebPush();

  app.listen(PORT, () => {
    console.log(`
  ██████╗ ██╗   ██╗██╗     ███████╗ ██████╗ ██████╗ ███████╗
  ██╔══██╗██║   ██║██║     ██╔════╝██╔═══██╗██╔══██╗██╔════╝
  ██████╔╝██║   ██║██║     ███████╗██║   ██║██████╔╝███████╗
  ██╔═══╝ ██║   ██║██║     ╚════██║██║   ██║██╔═══╝ ╚════██║
  ██║     ╚██████╔╝███████╗███████║╚██████╔╝██║     ███████║
  ╚═╝      ╚═════╝ ╚══════╝╚══════╝ ╚═════╝ ╚═╝     ╚══════╝
  
  🚀 PulsOps API Server
  ✅ Running on http://localhost:${PORT}
  ✅ Environment: ${process.env.NODE_ENV || 'development'}
  ✅ Health: http://localhost:${PORT}/health
    `);
  });
};

start().catch((err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});

export default app;
