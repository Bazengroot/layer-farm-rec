"use strict";
// backend/src/routes/report.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportRouter = void 0;
const express_1 = require("express");
const reportController_1 = require("../controllers/reportController");
const permissionMiddleware_1 = require("../middleware/permissionMiddleware");
const router = (0, express_1.Router)();
router.get('/daily-flock', (0, permissionMiddleware_1.checkPermission)('performance:view'), reportController_1.getDailyFlockReport);
router.get('/data', (0, permissionMiddleware_1.checkPermission)('performance:view'), reportController_1.getGenericReport);
exports.reportRouter = router;
//# sourceMappingURL=report.js.map