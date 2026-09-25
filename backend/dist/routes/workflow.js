"use strict";
// backend/src/routes/workflow.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.workflowRouter = void 0;
const express_1 = require("express");
const workflowController_1 = require("../controllers/workflowController");
const permissionMiddleware_1 = require("../middleware/permissionMiddleware");
const router = (0, express_1.Router)();
// Approvals
router.post('/approval/submit', workflowController_1.submitApproval);
router.post('/approval/review', workflowController_1.reviewApproval);
router.get('/approval/pending', workflowController_1.getPendingApprovals);
// Corrections
router.post('/correction/request', workflowController_1.requestCorrection);
router.post('/correction/review', workflowController_1.reviewCorrection);
router.get('/correction/history', workflowController_1.getCorrectionHistory);
// Evidence
router.post('/evidence/register', workflowController_1.registerEvidence);
router.get('/evidence', workflowController_1.getEvidence);
router.delete('/evidence/:id', workflowController_1.deleteEvidence);
// Audit Logs
router.get('/audit-logs', (0, permissionMiddleware_1.checkPermission)('performance:view'), workflowController_1.getAuditLogs);
exports.workflowRouter = router;
//# sourceMappingURL=workflow.js.map