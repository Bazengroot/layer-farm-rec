// backend/src/routes/dailyHealth.ts

import { Router } from 'express';
import { dailyHealthController } from '../controllers/dailyHealthController';

const router = Router();

// List daily health records
router.get('/', async (req, res) => {
  await dailyHealthController.list(req, res);
});

// Create new record
router.post('/', async (req, res) => {
  await dailyHealthController.create(req, res);
});

// Update record
router.put('/:id', async (req, res) => {
  await dailyHealthController.update(req, res);
});

// Delete record
router.delete('/:id', async (req, res) => {
  await dailyHealthController.delete(req, res);
});

export const dailyHealthRouter = router;
