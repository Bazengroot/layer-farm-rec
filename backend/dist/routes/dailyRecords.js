"use strict";
// backend/src/routes/dailyRecords.ts
// Router for Daily Recording Engine endpoints
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dailyRecordController_1 = require("../controllers/dailyRecordController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const permissionMiddleware_1 = require("../middleware/permissionMiddleware");
const router = (0, express_1.Router)();
// Create a new draft record
router.post('/draft', authMiddleware_1.authMiddleware, (0, permissionMiddleware_1.checkPermission)('create_recording'), dailyRecordController_1.createDraft);
// Update an existing draft
router.put('/draft/:id', authMiddleware_1.authMiddleware, (0, permissionMiddleware_1.checkPermission)('edit_recording'), dailyRecordController_1.saveDraft);
// Submit a draft for review
router.post('/submit/:id', authMiddleware_1.authMiddleware, (0, permissionMiddleware_1.checkPermission)('edit_recording'), dailyRecordController_1.submitRecord);
// Approve/reject a submitted record
router.post('/review/:id', authMiddleware_1.authMiddleware, (0, permissionMiddleware_1.checkPermission)('approve_recording'), dailyRecordController_1.reviewRecord);
// Request a correction on a record
router.post('/correction/:id', authMiddleware_1.authMiddleware, (0, permissionMiddleware_1.checkPermission)('edit_recording'), dailyRecordController_1.requestCorrection);
// Get historical records for a flock
router.get('/history/:flock_id', authMiddleware_1.authMiddleware, (0, permissionMiddleware_1.checkPermission)('view_farm'), dailyRecordController_1.getHistorical);
exports.default = router;
//# sourceMappingURL=dailyRecords.js.map