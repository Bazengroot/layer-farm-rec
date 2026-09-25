// backend/src/routes/eggDispatch.ts

import { Router } from 'express';
import { eggDispatchController } from '../controllers/eggDispatchController';

const router = Router();

router.post('/draft', eggDispatchController.createDraft); // create draft dispatch
router.post('/:dispatchId/approve', eggDispatchController.approve);
router.post('/:dispatchId/cancel', eggDispatchController.cancel);
router.get('/', eggDispatchController.list);

export default router;
