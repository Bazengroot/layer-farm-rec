// backend/src/routes/workflow.ts

import { Router } from 'express';
import {
  submitApproval,
  reviewApproval,
  getPendingApprovals,
  requestCorrection,
  reviewCorrection,
  getCorrectionHistory,
  registerEvidence,
  getEvidence,
  deleteEvidence,
  getAuditLogs,
} from '../controllers/workflowController';
import { checkPermission } from '../middleware/permissionMiddleware';

const router = Router();

// Approvals
router.post('/approval/submit', submitApproval);
router.post('/approval/review', reviewApproval);
router.get('/approval/pending', getPendingApprovals);

// Corrections
router.post('/correction/request', requestCorrection);
router.post('/correction/review', reviewCorrection);
router.get('/correction/history', getCorrectionHistory);

// Evidence
router.post('/evidence/register', registerEvidence);
router.get('/evidence', getEvidence);
router.delete('/evidence/:id', deleteEvidence);

// Audit Logs
router.get('/audit-logs', checkPermission('performance:view'), getAuditLogs);

export const workflowRouter = router;
