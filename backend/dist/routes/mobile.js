"use strict";
// backend/src/routes/mobile.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.mobileRouter = void 0;
const express_1 = require("express");
const mobileController_1 = require("../controllers/mobileController");
const router = (0, express_1.Router)();
router.get('/notifications', mobileController_1.getNotifications);
router.patch('/notifications/:id/read', mobileController_1.markNotificationRead);
router.post('/sync', mobileController_1.syncOfflineQueue);
exports.mobileRouter = router;
//# sourceMappingURL=mobile.js.map