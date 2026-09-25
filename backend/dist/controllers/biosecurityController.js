"use strict";
// backend/src/controllers/biosecurityController.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.biosecurityController = void 0;
const permissionMiddleware_1 = require("../middleware/permissionMiddleware");
const biosecurityService_1 = require("../services/biosecurityService");
const AppError_1 = require("../utils/AppError");
exports.biosecurityController = {
    async list(req, res) {
        await (0, permissionMiddleware_1.checkPermission)(req, 'biosecurity:view');
        const orgId = req.user.organization_id;
        if (!orgId)
            throw AppError_1.AppError.forbidden('Organization context is required', 'MISSING_ORG');
        const data = await biosecurityService_1.biosecurityService.list(orgId);
        res.json(data);
    },
    async create(req, res) {
        await (0, permissionMiddleware_1.checkPermission)(req, 'biosecurity:manage');
        const orgId = req.user.organization_id;
        if (!orgId)
            throw AppError_1.AppError.forbidden('Organization context is required', 'MISSING_ORG');
        await biosecurityService_1.biosecurityService.create(orgId, req.body);
        res.status(201).json({ message: 'Biosecurity checklist record created' });
    },
    async update(req, res) {
        await (0, permissionMiddleware_1.checkPermission)(req, 'biosecurity:manage');
        const { id } = req.params;
        await biosecurityService_1.biosecurityService.update(id, req.body);
        res.json({ message: 'Biosecurity checklist record updated' });
    },
    async delete(req, res) {
        await (0, permissionMiddleware_1.checkPermission)(req, 'biosecurity:manage');
        const { id } = req.params;
        await biosecurityService_1.biosecurityService.delete(id);
        res.json({ message: 'Biosecurity checklist record deleted' });
    },
};
//# sourceMappingURL=biosecurityController.js.map