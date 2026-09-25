// backend/src/controllers/medicationController.ts

import { Request, Response } from 'express';
import { checkPermission } from '../middleware/permissionMiddleware';
import { medicationService } from '../services/medicationService';
import { AppError } from '../utils/AppError';

export const medicationController = {
  async list(req: Request, res: Response) {
    await checkPermission(req, 'medication:view');
    const orgId = req.user.organization_id;
    if (!orgId) throw AppError.forbidden('Organization context is required', 'MISSING_ORG');
    const data = await medicationService.list(orgId);
    res.json(data);
  },
  async create(req: Request, res: Response) {
    await checkPermission(req, 'medication:prescribe');
    const orgId = req.user.organization_id;
    if (!orgId) throw AppError.forbidden('Organization context is required', 'MISSING_ORG');
    await medicationService.create(orgId, req.body);
    res.status(201).json({ message: 'Medication record created' });
  },
  async update(req: Request, res: Response) {
    await checkPermission(req, 'medication:prescribe');
    const { id } = req.params;
    await medicationService.update(id, req.body);
    res.json({ message: 'Medication record updated' });
  },
  async delete(req: Request, res: Response) {
    await checkPermission(req, 'medication:prescribe');
    const { id } = req.params;
    await medicationService.delete(id);
    res.json({ message: 'Medication record deleted' });
  },
};
