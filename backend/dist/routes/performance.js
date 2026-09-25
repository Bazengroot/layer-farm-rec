"use strict";
// backend/src/routes/performance.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.performanceRouter = void 0;
const express_1 = require("express");
const performanceController_1 = require("../controllers/performanceController");
const permissionMiddleware_1 = require("../middleware/permissionMiddleware");
const router = (0, express_1.Router)();
// GET /api/performance/kpis?flockId=...&startDate=...&endDate=...
router.get('/kpis', (0, permissionMiddleware_1.checkPermission)('performance:view'), performanceController_1.getFlockKPIs);
exports.performanceRouter = router;
//# sourceMappingURL=performance.js.map