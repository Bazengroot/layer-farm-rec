// backend/src/routes/operations.ts

import { Router } from 'express';
import {
  getInventoryItems,
  createInventoryItem,
  recordInventoryTx,
  getExpenses,
  recordExpense,
  getTasks,
  createTask,
  updateTaskStatus,
  getEquipment,
  addEquipment,
  logEquipmentMaintenance,
  getEmployees,
  addEmployee,
} from '../controllers/operationsController';

const router = Router();

// Inventory
router.get('/inventory', getInventoryItems);
router.post('/inventory/item', createInventoryItem);
router.post('/inventory/transaction', recordInventoryTx);

// Expenses
router.get('/expenses', getExpenses);
router.post('/expenses', recordExpense);

// Tasks
router.get('/tasks', getTasks);
router.post('/tasks', createTask);
router.patch('/tasks/:id/status', updateTaskStatus);

// Equipment
router.get('/equipment', getEquipment);
router.post('/equipment', addEquipment);
router.post('/equipment/maintenance', logEquipmentMaintenance);

// Workforce
router.get('/workforce', getEmployees);
router.post('/workforce', addEmployee);

export const operationsRouter = router;
