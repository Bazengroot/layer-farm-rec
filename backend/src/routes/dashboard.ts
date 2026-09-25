// backend/src/routes/dashboard.ts

import { Router } from 'express';
import {
  getFarmManagerDashboard,
  getSiteManagerDashboard,
  getVetDashboard,
  getInventoryDashboard,
  getBODDashboard,
} from '../controllers/dashboardController';
import { checkPermission } from '../middleware/permissionMiddleware';

const router = Router();

router.get('/farm-manager', checkPermission('performance:view'), getFarmManagerDashboard);
router.get('/site-manager', checkPermission('performance:view'), getSiteManagerDashboard);
router.get('/vet', checkPermission('performance:view'), getVetDashboard);
router.get('/inventory', checkPermission('performance:view'), getInventoryDashboard);
router.get('/bod', checkPermission('performance:view'), getBODDashboard);

export const dashboardRouter = router;
