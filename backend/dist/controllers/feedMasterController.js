"use strict";
// backend/src/controllers/feedMasterController.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.feedMasterController = void 0;
const feedMasterService_1 = require("../services/feedMasterService");
const permissionMiddleware_1 = require("../middleware/permissionMiddleware");
/**
 * Controller for Feed Master Data (units, types, etc.).
 * Only a subset of CRUD operations are exposed here as examples.
 */
exports.feedMasterController = {
    // ---- Units ----
    async createUnit(req, res) {
        try {
            await (0, permissionMiddleware_1.checkPermission)(req, 'manage_feed_inventory');
            const unit = await feedMasterService_1.feedMasterService.createUnit(req.body);
            res.status(201).json(unit);
        }
        catch (err) {
            console.error('Error creating feed unit', err);
            res.status(err.status || 500).json({ error: err.message });
        }
    },
    async listUnits(req, res) {
        try {
            await (0, permissionMiddleware_1.checkPermission)(req, 'view_feed_reports');
            const { organizationId } = req.query;
            const units = await feedMasterService_1.feedMasterService.listUnits(organizationId);
            res.json(units);
        }
        catch (err) {
            console.error('Error listing feed units', err);
            res.status(err.status || 500).json({ error: err.message });
        }
    },
    async updateUnit(req, res) {
        try {
            await (0, permissionMiddleware_1.checkPermission)(req, 'manage_feed_inventory');
            const { id } = req.params;
            const result = await feedMasterService_1.feedMasterService.updateUnit(id, req.body);
            res.json(result);
        }
        catch (err) {
            console.error('Error updating feed unit', err);
            res.status(err.status || 500).json({ error: err.message });
        }
    },
    async deleteUnit(req, res) {
        try {
            await (0, permissionMiddleware_1.checkPermission)(req, 'manage_feed_inventory');
            const { id } = req.params;
            const result = await feedMasterService_1.feedMasterService.deleteUnit(id);
            res.json(result);
        }
        catch (err) {
            console.error('Error deleting feed unit', err);
            res.status(err.status || 500).json({ error: err.message });
        }
    },
    // ---- Types (example: create only) ----
    async createType(req, res) {
        try {
            await (0, permissionMiddleware_1.checkPermission)(req, 'manage_feed_inventory');
            const type = await feedMasterService_1.feedMasterService.createType(req.body);
            res.status(201).json(type);
        }
        catch (err) {
            console.error('Error creating feed type', err);
            res.status(err.status || 500).json({ error: err.message });
        }
    },
};
//# sourceMappingURL=feedMasterController.js.map