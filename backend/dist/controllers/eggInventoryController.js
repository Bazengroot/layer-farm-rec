"use strict";
// backend/src/controllers/eggInventoryController.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.eggInventoryController = void 0;
const eggInventoryService_1 = require("../services/eggInventoryService");
const permissionMiddleware_1 = require("../middleware/permissionMiddleware");
exports.eggInventoryController = {
    async createTransaction(req, res) {
        try {
            await (0, permissionMiddleware_1.checkPermission)(req, 'egg:inventory:manage');
            const transaction = await eggInventoryService_1.eggInventoryService.createTransaction(req.body);
            res.status(201).json(transaction);
        }
        catch (err) {
            console.error('Error creating inventory transaction', err);
            res.status(err.status || 500).json({ error: err.message });
        }
    },
    async getBalance(req, res) {
        try {
            await (0, permissionMiddleware_1.checkPermission)(req, 'egg:inventory:manage');
            const balance = await eggInventoryService_1.eggInventoryService.getBalance(req.query);
            res.json(balance);
        }
        catch (err) {
            console.error('Error getting inventory balance', err);
            res.status(err.status || 500).json({ error: err.message });
        }
    },
};
//# sourceMappingURL=eggInventoryController.js.map