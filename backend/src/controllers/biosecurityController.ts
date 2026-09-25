// backend/src/controllers/biosecurityController.ts

import { Request, Response } from 'express';
import { checkPermission } from '../middleware/permissionMiddleware';
import { biosecurityService } from '../services/biosecurityService';
import { AppError } from '../utils/AppError';

export const biosecurityController = {
  async list(req: Request, res: Response) {
    await checkPermission(req, 'biosecurity:view');
    const orgId = req.user.organization_id;
    if (!orgId) throw AppError.forbidden('Organization context is required', 'MISSING_ORG');
    const data = await biosecurityService.list(orgId);
    res.json(data);
  },
  async create(req: Request, res: Response) {
    await checkPermission(req, 'biosecurity:manage');
    const orgId = req.user.organization_id;
    if (!orgId) throw AppError.forbidden('Organization context is required', 'MISSING_ORG');
    await biosecurityService.create(orgId, req.body);
    res.status(201).json({ message: 'Biosecurity checklist record created' });
  },
  async update(req: Request, res: Response) {
    await checkPermission(req, 'biosecurity:manage');
    const { id } = req.params;
    await biosecurityService.update(id, req.body);
    res.json({ message: 'Biosecurity checklist record updated' });
  },
  async delete(req: Request, res: Response) {
    await checkPermission(req, 'biosecurity:manage');
    const { id } = req.params;
    await biosecurityService.delete(id);
    res.json({ message: 'Biosecurity checklist record deleted' });
  },
};
