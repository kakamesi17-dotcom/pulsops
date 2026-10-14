import { Router } from 'express';
import * as authController from './auth.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import {
  loginValidators,
  refreshValidators,
  changePasswordValidators,
} from './auth.validators';

const router = Router();

/**
 * @route  POST /api/auth/login
 * @desc   Login with email + password — auto-resolves role and tenant
 * @access Public
 */
router.post('/login', loginValidators, validate, authController.login);

/**
 * @route  POST /api/auth/refresh
 * @desc   Refresh access token using refresh token
 * @access Public
 */
router.post('/refresh', refreshValidators, validate, authController.refresh);

/**
 * @route  POST /api/auth/logout
 * @desc   Revoke refresh token
 * @access Public
 */
router.post('/logout', authController.logout);

/**
 * @route  GET /api/auth/me
 * @desc   Get current authenticated user profile
 * @access Private
 */
router.get('/me', authenticate, authController.me);

/**
 * @route  PATCH /api/auth/change-password
 * @desc   Change own password
 * @access Private
 */
router.patch('/change-password', authenticate, changePasswordValidators, validate, authController.changePassword);

/**
 * @route  PATCH /api/auth/fcm-token
 * @desc   Update Firebase Cloud Messaging token
 * @access Private
 */
router.patch('/fcm-token', authenticate, authController.updateFcmToken);

/**
 * @route  PATCH /api/auth/web-push
 * @desc   Save Web Push subscription
 * @access Private
 */
router.patch('/web-push', authenticate, authController.updateWebPush);

export default router;
