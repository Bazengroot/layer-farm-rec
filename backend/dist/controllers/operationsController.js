"use strict";
// backend/src/controllers/operationsController.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.addEmployee = exports.getEmployees = exports.logEquipmentMaintenance = exports.addEquipment = exports.getEquipment = exports.updateTaskStatus = exports.createTask = exports.getTasks = exports.recordExpense = exports.getExpenses = exports.recordInventoryTx = exports.createInventoryItem = exports.getInventoryItems = void 0;
const inventoryService_1 = require("../services/inventoryService");
const expenseService_1 = require("../services/expenseService");
const taskService_1 = require("../services/taskService");
const equipmentService_1 = require("../services/equipmentService");
const workforceService_1 = require("../services/workforceService");
const paginateArray_1 = require("../utils/paginateArray");
// --- INVENTORY ---
const getInventoryItems = async (req, res) => {
    try {
        const { farmId, page = '1', size = '50' } = req.query;
        const items = await inventoryService_1.inventoryService.getInventoryItems(farmId);
        const paged = (0, paginateArray_1.paginateArray)(items, Number(page), Number(size));
        return res.status(200).json(paged);
    }
    catch (err) {
        return res.status(500).json({ error: err.message || 'Server error' });
    }
};
exports.getInventoryItems = getInventoryItems;
const createInventoryItem = async (req, res) => {
    try {
        const item = await inventoryService_1.inventoryService.createInventoryItem(req.body);
        return res.status(201).json(item);
    }
    catch (err) {
        return res.status(500).json({ error: err.message || 'Server error' });
    }
};
exports.createInventoryItem = createInventoryItem;
const recordInventoryTx = async (req, res) => {
    try {
        const tx = await inventoryService_1.inventoryService.recordTransaction(req.body);
        return res.status(201).json(tx);
    }
    catch (err) {
        return res.status(500).json({ error: err.message || 'Server error' });
    }
};
exports.recordInventoryTx = recordInventoryTx;
// --- EXPENSES ---
const getExpenses = async (req, res) => {
    try {
        const { farmId, page = '1', size = '50' } = req.query;
        const expenses = await expenseService_1.expenseService.getExpenses(farmId);
        const paged = (0, paginateArray_1.paginateArray)(expenses, Number(page), Number(size));
        return res.status(200).json(paged);
    }
    catch (err) {
        return res.status(500).json({ error: err.message || 'Server error' });
    }
};
exports.getExpenses = getExpenses;
const recordExpense = async (req, res) => {
    try {
        const expense = await expenseService_1.expenseService.recordExpense(req.body);
        return res.status(201).json(expense);
    }
    catch (err) {
        return res.status(500).json({ error: err.message || 'Server error' });
    }
};
exports.recordExpense = recordExpense;
// --- TASKS ---
const getTasks = async (req, res) => {
    try {
        const { status, page = '1', size = '50' } = req.query;
        const tasks = await taskService_1.taskService.getTasks(status);
        const paged = (0, paginateArray_1.paginateArray)(tasks, Number(page), Number(size));
        return res.status(200).json(paged);
    }
    catch (err) {
        return res.status(500).json({ error: err.message || 'Server error' });
    }
};
exports.getTasks = getTasks;
const createTask = async (req, res) => {
    try {
        const task = await taskService_1.taskService.createTask(req.body);
        return res.status(201).json(task);
    }
    catch (err) {
        return res.status(500).json({ error: err.message || 'Server error' });
    }
};
exports.createTask = createTask;
const updateTaskStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes, approvedBy } = req.body;
        const task = await taskService_1.taskService.updateTaskStatus(id, status, notes, approvedBy);
        return res.status(200).json(task);
    }
    catch (err) {
        return res.status(500).json({ error: err.message || 'Server error' });
    }
};
exports.updateTaskStatus = updateTaskStatus;
// --- EQUIPMENT ---
const getEquipment = async (_req, res) => {
    try {
        const { page = '1', size = '50' } = _req.query;
        const equip = await equipmentService_1.equipmentService.getEquipment();
        const paged = (0, paginateArray_1.paginateArray)(equip, Number(page), Number(size));
        return res.status(200).json(paged);
    }
    catch (err) {
        return res.status(500).json({ error: err.message || 'Server error' });
    }
};
exports.getEquipment = getEquipment;
const addEquipment = async (req, res) => {
    try {
        const equip = await equipmentService_1.equipmentService.addEquipment(req.body);
        return res.status(201).json(equip);
    }
    catch (err) {
        return res.status(500).json({ error: err.message || 'Server error' });
    }
};
exports.addEquipment = addEquipment;
const logEquipmentMaintenance = async (req, res) => {
    try {
        const { equipmentId, performedBy, description, cost, notes } = req.body;
        const log = await equipmentService_1.equipmentService.logMaintenance(equipmentId, performedBy, description, cost, notes);
        return res.status(201).json(log);
    }
    catch (err) {
        return res.status(500).json({ error: err.message || 'Server error' });
    }
};
exports.logEquipmentMaintenance = logEquipmentMaintenance;
// --- WORKFORCE ---
const getEmployees = async (req, res) => {
    try {
        const { farmId, page = '1', size = '50' } = req.query;
        const employees = await workforceService_1.workforceService.getEmployees(farmId);
        const paged = (0, paginateArray_1.paginateArray)(employees, Number(page), Number(size));
        return res.status(200).json(paged);
    }
    catch (err) {
        return res.status(500).json({ error: err.message || 'Server error' });
    }
};
exports.getEmployees = getEmployees;
const addEmployee = async (req, res) => {
    try {
        const emp = await workforceService_1.workforceService.addEmployee(req.body);
        return res.status(201).json(emp);
    }
    catch (err) {
        return res.status(500).json({ error: err.message || 'Server error' });
    }
};
exports.addEmployee = addEmployee;
//# sourceMappingURL=operationsController.js.map