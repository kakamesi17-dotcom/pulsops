import { body } from 'express-validator';

export const loginValidators = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const refreshValidators = [
  body('refreshToken').notEmpty().withMessage('Refresh token is required'),
];

export const changePasswordValidators = [
  body('currentPassword').notEmpty().withMessage('Current password required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .withMessage('Password must contain uppercase, lowercase, number, and special character'),
];
