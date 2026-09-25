"use strict";
// backend/src/controllers/eggDispatchController.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.eggDispatchController = void 0;
const eggDispatchService_1 = require("../services/eggDispatchService");
const permissionMiddleware_1 = require("../middleware/permissionMiddleware");
exports.eggDispatchController = {
    async createDraft(req, res) {
        try {
            await (0, permissionMiddleware_1.checkPermission)(req, 'egg:inventory:manage');
            const draft = await eggDispatchService_1.eggDispatchService.createDraft(req.body);
            res.status(201).json(draft);
        }
        catch (err) {
            console.error('Error creating dispatch draft', err);
            res.status(err.status || 500).json({ error: err.message });
        }
    },
    async approve(req, res) {
        try {
            await (0, permissionMiddleware_1.checkPermission)(req, 'egg:dispatch:approve');
            const { dispatchId } = req.params;
            const { approverProfileId } = req.body;
            const result = await eggDispatchService_1.eggDispatchService.approve(dispatchId, approverProfileId);
            res.json(result);
        }
        catch (err) {
            console.error('Error approving dispatch', err);
            res.status(err.status || 500).json({ error: err.message });
        }
    },
    async cancel(req, res) {
        try {
            await (0, permissionMiddleware_1.checkPermission)(req, 'egg:dispatch:cancel');
            const { dispatchId } = req.params;
            const { cancellerProfileId } = req.body;
            const result = await eggDispatchService_1.eggDispatchService.cancel(dispatchId, cancellerProfileId);
            res.json(result);
        }
        catch (err) {
            console.error('Error cancelling dispatch', err);
            res.status(err.status || 500).json({ error: err.message });
        }
    },
    async list(req, res) {
        try {
            await (0, permissionMiddleware_1.checkPermission)(req, 'egg:view');
            const dispatches = await eggDispatchService_1.eggDispatchService.list(req.query);
            res.json(dispatches);
        }
        catch (err) {
            console.error('Error listing dispatches', err);
            res.status(err.status || 500).json({ error: err.message });
        }
    },
};
//# sourceMappingURL=eggDispatchController.js.map