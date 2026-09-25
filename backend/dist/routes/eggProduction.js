"use strict";
// backend/src/routes/eggProduction.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const eggProductionService_1 = __importDefault(require("../services/eggProductionService"));
const permissionMiddleware_1 = require("../middleware/permissionMiddleware");
const router = (0, express_1.Router)();
// Create draft production record
router.post('/production', async (req, res) => {
    try {
        await (0, permissionMiddleware_1.checkPermission)(req, 'egg:record');
        const record = await eggProductionService_1.default.createProduction(req.body);
        res.status(201).json(record);
    }
    catch (err) {
        console.error(err);
        res.status(err.status || 500).json({ error: err.message });
    }
});
// Update draft
router.put('/production/:id', async (req, res) => {
    try {
        await (0, permissionMiddleware_1.checkPermission)(req, 'egg:record');
        const updated = await eggProductionService_1.default.updateProduction(req.params.id, req.body);
        res.json(updated);
    }
    catch (err) {
        console.error(err);
        res.status(err.status || 500).json({ error: err.message });
    }
});
// Submit draft for review
router.post('/production/:id/submit', async (req, res) => {
    try {
        await (0, permissionMiddleware_1.checkPermission)(req, 'egg:record');
        const submitted = await eggProductionService_1.default.submitProduction(req.params.id);
        res.json(submitted);
    }
    catch (err) {
        console.error(err);
        res.status(err.status || 500).json({ error: err.message });
    }
});
// List production records
router.get('/production', async (req, res) => {
    try {
        await (0, permissionMiddleware_1.checkPermission)(req, 'egg:view');
        const records = await eggProductionService_1.default.listProductions(req.query);
        res.json(records);
    }
    catch (err) {
        console.error(err);
        res.status(err.status || 500).json({ error: err.message });
    }
});
// Summarize production
router.get('/production/summary', async (req, res) => {
    try {
        await (0, permissionMiddleware_1.checkPermission)(req, 'egg:view');
        const { farm_id, period } = req.query;
        const summary = await eggProductionService_1.default.summarizeProduction({ farm_id, period });
        res.json(summary);
    }
    catch (err) {
        console.error(err);
        res.status(err.status || 500).json({ error: err.message });
    }
});
exports.default = router;
//# sourceMappingURL=eggProduction.js.map