// backend/src/routes/performance.ts

import { Router } from 'express';
import { getFlockKPIs } from '../controllers/performanceController';
import { checkPermission } from '../middleware/permissionMiddleware';

const router = Router();

// GET /api/performance/kpis?flockId=...&startDate=...&endDate=...
router.get('/kpis', checkPermission('performance:view'), getFlockKPIs);

export const performanceRouter = router;
