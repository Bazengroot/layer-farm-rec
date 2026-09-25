"use strict";
// backend/src/controllers/vaccinationController.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.vaccinationController = void 0;
const permissionMiddleware_1 = require("../middleware/permissionMiddleware");
const vaccinationService_1 = require("../services/vaccinationService");
const AppError_1 = require("../utils/AppError");
exports.vaccinationController = {
    async list(req, res) {
        await (0, permissionMiddleware_1.checkPermission)(req, 'vaccination:view');
        const orgId = req.user.organization_id;
        if (!orgId)
            throw AppError_1.AppError.forbidden('Organization context is required', 'MISSING_ORG');
        const data = await vaccinationService_1.vaccinationService.list(orgId);
        res.json(data);
    },
    async create(req, res) {
        await (0, permissionMiddleware_1.checkPermission)(req, 'vaccination:record');
        const orgId = req.user.organization_id;
        if (!orgId)
            throw AppError_1.AppError.forbidden('Organization context is required', 'MISSING_ORG');
        await vaccinationService_1.vaccinationService.create(orgId, req.body);
        res.status(201).json({ message: 'Vaccination record created' });
    },
    async update(req, res) {
        await (0, permissionMiddleware_1.checkPermission)(req, 'vaccination:record');
        const { id } = req.params;
        await vaccinationService_1.vaccinationService.update(id, req.body);
        res.json({ message: 'Vaccination record updated' });
    },
    async delete(req, res) {
        await (0, permissionMiddleware_1.checkPermission)(req, 'vaccination:record');
        const { id } = req.params;
        await vaccinationService_1.vaccinationService.delete(id);
        res.json({ message: 'Vaccination record deleted' });
    },
};
//# sourceMappingURL=vaccinationController.js.map