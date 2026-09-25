// backend/src/routes/eggInventory.ts

import { Router } from 'express';
import { eggInventoryController } from '../controllers/eggInventoryController';

const router = Router();

router.post('/transaction', eggInventoryController.createTransaction);
router.get('/balance', eggInventoryController.getBalance);

export default router;
