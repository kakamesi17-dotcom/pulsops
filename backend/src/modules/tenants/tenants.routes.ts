import { Router } from 'express';
import * as tenantsController from './tenants.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { UserRole } from '@prisma/client';
import { upload } from '../../config/cloudinary';

const router = Router();
const superAdminOnly = [authenticate, authorize(UserRole.SUPER_ADMIN)];

router.get('/', ...superAdminOnly, tenantsController.listGyms);
router.post('/', ...superAdminOnly, upload.fields([{ name: 'logo', maxCount: 1 }]), tenantsController.createGym);
router.get('/:gymId', ...superAdminOnly, tenantsController.getGym);
router.patch('/:gymId', ...superAdminOnly, upload.fields([{ name: 'logo', maxCount: 1 }]), tenantsController.updateGym);
router.patch('/:gymId/status', ...superAdminOnly, tenantsController.setGymStatus);
router.patch('/:gymId/tier', ...superAdminOnly, tenantsController.changeGymTier);
router.delete('/:gymId', ...superAdminOnly, tenantsController.deleteGym);

export default router;
