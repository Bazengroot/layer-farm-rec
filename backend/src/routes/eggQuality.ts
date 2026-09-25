// backend/src/routes/eggQuality.ts

import { Router } from 'express';
import { eggQualityController } from '../controllers/eggQualityController';

const router = Router();

router.post('/', eggQualityController.create);
router.get('/', eggQualityController.list);

export default router;
