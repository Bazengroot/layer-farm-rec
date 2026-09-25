"use strict";
// backend/src/controllers/eggQualityController.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.eggQualityController = void 0;
const eggQualityService_1 = require("../services/eggQualityService");
const permissionMiddleware_1 = require("../middleware/permissionMiddleware");
exports.eggQualityController = {
    async create(req, res) {
        try {
            await (0, permissionMiddleware_1.checkPermission)(req, 'egg:quality:test');
            const record = await eggQualityService_1.eggQualityService.create(req.body);
            res.status(201).json(record);
        }
        catch (err) {
            console.error('Error creating quality record', err);
            res.status(err.status || 500).json({ error: err.message });
        }
    },
    async list(req, res) {
        try {
            await (0, permissionMiddleware_1.checkPermission)(req, 'egg:view');
            const records = await eggQualityService_1.eggQualityService.list(req.query);
            res.json(records);
        }
        catch (err) {
            console.error('Error listing quality records', err);
            res.status(err.status || 500).json({ error: err.message });
        }
    },
};
//# sourceMappingURL=eggQualityController.js.map