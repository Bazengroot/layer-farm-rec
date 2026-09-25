// backend/src/controllers/operationsController.ts

import { Request, Response } from 'express';
import { inventoryService } from '../services/inventoryService';
import { expenseService } from '../services/expenseService';
import { taskService } from '../services/taskService';
import { equipmentService } from '../services/equipmentService';
import { workforceService } from '../services/workforceService';
import { paginateArray } from '../utils/paginateArray';

// --- INVENTORY ---
export const getInventoryItems = async (req: Request, res: Response) => {
  try {
    const { farmId, page = '1', size = '50' } = req.query as any;
    const items = await inventoryService.getInventoryItems(farmId);
    const paged = paginateArray(items, Number(page), Number(size));
    return res.status(200).json(paged);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};

export const createInventoryItem = async (req: Request, res: Response) => {
  try {
    const item = await inventoryService.createInventoryItem(req.body);
    return res.status(201).json(item);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};

export const recordInventoryTx = async (req: Request, res: Response) => {
  try {
    const tx = await inventoryService.recordTransaction(req.body);
    return res.status(201).json(tx);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};

// --- EXPENSES ---
export const getExpenses = async (req: Request, res: Response) => {
  try {
    const { farmId, page = '1', size = '50' } = req.query as any;
    const expenses = await expenseService.getExpenses(farmId);
    const paged = paginateArray(expenses, Number(page), Number(size));
    return res.status(200).json(paged);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};

export const recordExpense = async (req: Request, res: Response) => {
  try {
    const expense = await expenseService.recordExpense(req.body);
    return res.status(201).json(expense);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};

// --- TASKS ---
export const getTasks = async (req: Request, res: Response) => {
  try {
    const { status, page = '1', size = '50' } = req.query as any;
    const tasks = await taskService.getTasks(status);
    const paged = paginateArray(tasks, Number(page), Number(size));
    return res.status(200).json(paged);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const task = await taskService.createTask(req.body);
    return res.status(201).json(task);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};

export const updateTaskStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, notes, approvedBy } = req.body;
    const task = await taskService.updateTaskStatus(id, status, notes, approvedBy);
    return res.status(200).json(task);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};

// --- EQUIPMENT ---
export const getEquipment = async (_req: Request, res: Response) => {
  try {
    const { page = '1', size = '50' } = _req.query as any;
    const equip = await equipmentService.getEquipment();
    const paged = paginateArray(equip, Number(page), Number(size));
    return res.status(200).json(paged);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};

export const addEquipment = async (req: Request, res: Response) => {
  try {
    const equip = await equipmentService.addEquipment(req.body);
    return res.status(201).json(equip);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};

export const logEquipmentMaintenance = async (req: Request, res: Response) => {
  try {
    const { equipmentId, performedBy, description, cost, notes } = req.body;
    const log = await equipmentService.logMaintenance(equipmentId, performedBy, description, cost, notes);
    return res.status(201).json(log);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};

// --- WORKFORCE ---
export const getEmployees = async (req: Request, res: Response) => {
  try {
    const { farmId, page = '1', size = '50' } = req.query as any;
    const employees = await workforceService.getEmployees(farmId);
    const paged = paginateArray(employees, Number(page), Number(size));
    return res.status(200).json(paged);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};

export const addEmployee = async (req: Request, res: Response) => {
  try {
    const emp = await workforceService.addEmployee(req.body);
    return res.status(201).json(emp);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};
