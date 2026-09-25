// backend/src/routes/report.ts

import { Router } from 'express';
import { getDailyFlockReport, getGenericReport } from '../controllers/reportController';
import { checkPermission } from '../middleware/permissionMiddleware';

const router = Router();

router.get('/daily-flock', checkPermission('performance:view'), getDailyFlockReport);
router.get('/data', checkPermission('performance:view'), getGenericReport);

export const reportRouter = router;
