// backend/src/routes/eggGrading.ts

import { Router } from 'express';
import { eggGradingController } from '../controllers/eggGradingController';

const router = Router();

router.post('/batch', eggGradingController.createBatch);
router.get('/batches', eggGradingController.listBatches);
router.put('/batch/:batchId', eggGradingController.updateBatch);

export default router;
