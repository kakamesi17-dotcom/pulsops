import { Router } from 'express';
import * as usersController from './users.controller';
import { authenticate, authorize, tenantGuard } from '../../middleware/auth.middleware';
import { UserRole } from '@prisma/client';
import { upload } from '../../config/cloudinary';

const router = Router({ mergeParams: true }); // mergeParams for :gymId

const gymAdminOrSuper = [
  authenticate,
  authorize(UserRole.SUPER_ADMIN, UserRole.GYM_ADMIN),
  tenantGuard,
];

const trainerOrAbove = [
  authenticate,
  authorize(UserRole.SUPER_ADMIN, UserRole.GYM_ADMIN, UserRole.TRAINER),
  tenantGuard,
];

router.get('/', ...gymAdminOrSuper, usersController.listUsers);
router.post('/', ...gymAdminOrSuper, upload.fields([{ name: 'avatar', maxCount: 1 }]), usersController.createUser);
router.get('/:userId', ...trainerOrAbove, usersController.getUser);
router.patch('/:userId', ...gymAdminOrSuper, upload.fields([{ name: 'avatar', maxCount: 1 }]), usersController.updateUser);
router.patch('/:userId/reset-password', ...gymAdminOrSuper, usersController.resetPassword);
router.post('/:userId/assign-trainer', ...gymAdminOrSuper, usersController.assignTrainer);
router.delete('/:userId', ...gymAdminOrSuper, usersController.deleteUser);

export default router;
