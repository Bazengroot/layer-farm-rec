"use strict";
// backend/src/controllers/dailyHealthController.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.dailyHealthController = void 0;
const permissionMiddleware_1 = require("../middleware/permissionMiddleware");
const dailyHealthService_1 = require("../services/dailyHealthService");
const AppError_1 = require("../utils/AppError");
/**
 * Controller for daily health record endpoints.
 * Permissions:
 *   - health:view   => list records (GET /api/health/daily)
 *   - health:record => create record (POST)
 *   - health:record => update record (PUT /:id)
 *   - health:record => delete record (DELETE /:id)
 */
exports.dailyHealthController = {
    async list(req, res) {
        await (0, permissionMiddleware_1.checkPermission)(req, 'health:view');
        const orgId = req.user.organization_id;
        if (!orgId)
            throw AppError_1.AppError.forbidden('Organization context is required', 'MISSING_ORG');
        const data = await dailyHealthService_1.dailyHealthService.list(orgId);
        res.json(data);
    },
    async create(req, res) {
        await (0, permissionMiddleware_1.checkPermission)(req, 'health:record');
        const orgId = req.user.organization_id;
        if (!orgId)
            throw AppError_1.AppError.forbidden('Organization context is required', 'MISSING_ORG');
        await dailyHealthService_1.dailyHealthService.create(orgId, req.body);
        res.status(201).json({ message: 'Daily health record created' });
    },
    async update(req, res) {
        await (0, permissionMiddleware_1.checkPermission)(req, 'health:record');
        const { id } = req.params;
        await dailyHealthService_1.dailyHealthService.update(id, req.body);
        res.json({ message: 'Daily health record updated' });
    },
    async delete(req, res) {
        await (0, permissionMiddleware_1.checkPermission)(req, 'health:record');
        const { id } = req.params;
        await dailyHealthService_1.dailyHealthService.delete(id);
        res.json({ message: 'Daily health record deleted' });
    },
};
//# sourceMappingURL=dailyHealthController.js.map