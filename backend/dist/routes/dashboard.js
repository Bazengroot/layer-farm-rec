"use strict";
// backend/src/routes/dashboard.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardRouter = void 0;
const express_1 = require("express");
const dashboardController_1 = require("../controllers/dashboardController");
const permissionMiddleware_1 = require("../middleware/permissionMiddleware");
const router = (0, express_1.Router)();
router.get('/farm-manager', (0, permissionMiddleware_1.checkPermission)('performance:view'), dashboardController_1.getFarmManagerDashboard);
router.get('/site-manager', (0, permissionMiddleware_1.checkPermission)('performance:view'), dashboardController_1.getSiteManagerDashboard);
router.get('/vet', (0, permissionMiddleware_1.checkPermission)('performance:view'), dashboardController_1.getVetDashboard);
router.get('/inventory', (0, permissionMiddleware_1.checkPermission)('performance:view'), dashboardController_1.getInventoryDashboard);
router.get('/bod', (0, permissionMiddleware_1.checkPermission)('performance:view'), dashboardController_1.getBODDashboard);
exports.dashboardRouter = router;
//# sourceMappingURL=dashboard.js.map