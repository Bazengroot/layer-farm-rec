"use strict";
// backend/src/controllers/medicationController.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.medicationController = void 0;
const permissionMiddleware_1 = require("../middleware/permissionMiddleware");
const medicationService_1 = require("../services/medicationService");
const AppError_1 = require("../utils/AppError");
exports.medicationController = {
    async list(req, res) {
        await (0, permissionMiddleware_1.checkPermission)(req, 'medication:view');
        const orgId = req.user.organization_id;
        if (!orgId)
            throw AppError_1.AppError.forbidden('Organization context is required', 'MISSING_ORG');
        const data = await medicationService_1.medicationService.list(orgId);
        res.json(data);
    },
    async create(req, res) {
        await (0, permissionMiddleware_1.checkPermission)(req, 'medication:prescribe');
        const orgId = req.user.organization_id;
        if (!orgId)
            throw AppError_1.AppError.forbidden('Organization context is required', 'MISSING_ORG');
        await medicationService_1.medicationService.create(orgId, req.body);
        res.status(201).json({ message: 'Medication record created' });
    },
    async update(req, res) {
        await (0, permissionMiddleware_1.checkPermission)(req, 'medication:prescribe');
        const { id } = req.params;
        await medicationService_1.medicationService.update(id, req.body);
        res.json({ message: 'Medication record updated' });
    },
    async delete(req, res) {
        await (0, permissionMiddleware_1.checkPermission)(req, 'medication:prescribe');
        const { id } = req.params;
        await medicationService_1.medicationService.delete(id);
        res.json({ message: 'Medication record deleted' });
    },
};
//# sourceMappingURL=medicationController.js.map