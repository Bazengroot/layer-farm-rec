// backend/src/routes/feedMaster.ts

import { Router } from 'express';
import { feedMasterController } from '../controllers/feedMasterController';

const router = Router();

// Units CRUD
router.post('/units', feedMasterController.createUnit);
router.get('/units', feedMasterController.listUnits);
router.put('/units/:id', feedMasterController.updateUnit);
router.delete('/units/:id', feedMasterController.deleteUnit);

// Types (only create example)
router.post('/types', feedMasterController.createType);

export default router;
