// backend/src/routes/vaccination.ts

import { Router } from 'express';
import { vaccinationController } from '../controllers/vaccinationController';

const router = Router();

router.get('/', async (req, res) => {
  await vaccinationController.list(req, res);
});
router.post('/', async (req, res) => {
  await vaccinationController.create(req, res);
});
router.put('/:id', async (req, res) => {
  await vaccinationController.update(req, res);
});
router.delete('/:id', async (req, res) => {
  await vaccinationController.delete(req, res);
});

export const vaccinationRouter = router;
