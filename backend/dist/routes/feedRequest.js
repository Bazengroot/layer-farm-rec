"use strict";
// backend/src/routes/feedRequest.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const feedRequestController_1 = require("../controllers/feedRequestController");
const router = (0, express_1.Router)();
// Create a new feed request (draft)
router.post('/', feedRequestController_1.feedRequestController.create);
// Submit a draft request for approval
router.post('/:id/submit', feedRequestController_1.feedRequestController.submit);
// Approve a submitted request
router.post('/:id/approve', feedRequestController_1.feedRequestController.approve);
// Reject a submitted request
router.post('/:id/reject', feedRequestController_1.feedRequestController.reject);
// List requests with optional query filters
router.get('/', feedRequestController_1.feedRequestController.list);
exports.default = router;
//# sourceMappingURL=feedRequest.js.map