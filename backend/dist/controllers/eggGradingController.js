"use strict";
// backend/src/controllers/eggGradingController.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.eggGradingController = void 0;
const eggGradingService_1 = require("../services/eggGradingService");
const permissionMiddleware_1 = require("../middleware/permissionMiddleware");
/**
 * Controller for egg grading operations.
 * All endpoints are protected by permission checks.
 */
exports.eggGradingController = {
    async createBatch(req, res) {
        try {
            await (0, permissionMiddleware_1.checkPermission)(req, 'manage_egg');
            const batch = await eggGradingService_1.eggGradingService.createBatch(req.body);
            res.status(201).json(batch);
        }
        catch (err) {
            console.error('Error creating grading batch', err);
            res.status(err.status || 500).json({ error: err.message });
        }
    },
    async listBatches(req, res) {
        try {
            await (0, permissionMiddleware_1.checkPermission)(req, 'view_egg');
            const batches = await eggGradingService_1.eggGradingService.listBatches(req.query);
            res.json(batches);
        }
        catch (err) {
            console.error('Error listing grading batches', err);
            res.status(err.status || 500).json({ error: err.message });
        }
    },
    async updateBatch(req, res) {
        try {
            await (0, permissionMiddleware_1.checkPermission)(req, 'manage_egg');
            const { batchId } = req.params;
            const result = await eggGradingService_1.eggGradingService.updateBatch(batchId, req.body);
            res.json(result);
        }
        catch (err) {
            console.error('Error updating grading batch', err);
            res.status(err.status || 500).json({ error: err.message });
        }
    },
};
//# sourceMappingURL=eggGradingController.js.map