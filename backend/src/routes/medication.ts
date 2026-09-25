// backend/src/routes/medication.ts

import { Router } from 'express';
import { medicationController } from '../controllers/medicationController';

const router = Router();

router.get('/', async (req, res) => {
  await medicationController.list(req, res);
});
router.post('/', async (req, res) => {
  await medicationController.create(req, res);
});
router.put('/:id', async (req, res) => {
  await medicationController.update(req, res);
});
router.delete('/:id', async (req, res) => {
  await medicationController.delete(req, res);
});

export const medicationRouter = router;
