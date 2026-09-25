"use strict";
// backend/src/routes/operations.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.operationsRouter = void 0;
const express_1 = require("express");
const operationsController_1 = require("../controllers/operationsController");
const router = (0, express_1.Router)();
// Inventory
router.get('/inventory', operationsController_1.getInventoryItems);
router.post('/inventory/item', operationsController_1.createInventoryItem);
router.post('/inventory/transaction', operationsController_1.recordInventoryTx);
// Expenses
router.get('/expenses', operationsController_1.getExpenses);
router.post('/expenses', operationsController_1.recordExpense);
// Tasks
router.get('/tasks', operationsController_1.getTasks);
router.post('/tasks', operationsController_1.createTask);
router.patch('/tasks/:id/status', operationsController_1.updateTaskStatus);
// Equipment
router.get('/equipment', operationsController_1.getEquipment);
router.post('/equipment', operationsController_1.addEquipment);
router.post('/equipment/maintenance', operationsController_1.logEquipmentMaintenance);
// Workforce
router.get('/workforce', operationsController_1.getEmployees);
router.post('/workforce', operationsController_1.addEmployee);
exports.operationsRouter = router;
//# sourceMappingURL=operations.js.map