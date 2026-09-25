// backend/src/routes/dailyRecords.ts
// Router for Daily Recording Engine endpoints

import { Router } from 'express';
import {
  createDraft,
  saveDraft,
  submitRecord,
  reviewRecord,
  requestCorrection,
  getHistorical,
} from '../controllers/dailyRecordController';
import { authMiddleware } from '../middleware/authMiddleware';
import { checkPermission } from '../middleware/permissionMiddleware';

const router = Router();

// Create a new draft record
router.post('/draft', authMiddleware, checkPermission('create_recording'), createDraft);

// Update an existing draft
router.put('/draft/:id', authMiddleware, checkPermission('edit_recording'), saveDraft);

// Submit a draft for review
router.post('/submit/:id', authMiddleware, checkPermission('edit_recording'), submitRecord);

// Approve/reject a submitted record
router.post('/review/:id', authMiddleware, checkPermission('approve_recording'), reviewRecord);

// Request a correction on a record
router.post('/correction/:id', authMiddleware, checkPermission('edit_recording'), requestCorrection);

// Get historical records for a flock
router.get('/history/:flock_id', authMiddleware, checkPermission('view_farm'), getHistorical);

export default router;
