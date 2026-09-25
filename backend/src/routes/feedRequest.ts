// backend/src/routes/feedRequest.ts

import { Router } from 'express';
import { feedRequestController } from '../controllers/feedRequestController';

const router = Router();

// Create a new feed request (draft)
router.post('/', feedRequestController.create);

// Submit a draft request for approval
router.post('/:id/submit', feedRequestController.submit);

// Approve a submitted request
router.post('/:id/approve', feedRequestController.approve);

// Reject a submitted request
router.post('/:id/reject', feedRequestController.reject);

// List requests with optional query filters
router.get('/', feedRequestController.list);

export default router;
