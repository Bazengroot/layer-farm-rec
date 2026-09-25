// backend/src/controllers/vaccinationController.ts

import { Request, Response } from 'express';
import { checkPermission } from '../middleware/permissionMiddleware';
import { vaccinationService } from '../services/vaccinationService';

export const vaccinationController = {
  async list(req: Request, res: Response) {
    const orgId = req.user.organization_id;
    await checkPermission(req, 'vaccination:view');
    const data = await vaccinationService.list(orgId);
    res.json(data);
  },
  async create(req: Request, res: Response) {
    const orgId = req.user.organization_id;
    await checkPermission(req, 'vaccination:record');
    await vaccinationService.create(orgId, req.body);
    res.status(201).json({ message: 'Vaccination record created' });
  },
  async update(req: Request, res: Response) {
    await checkPermission(req, 'vaccination:record');
    const { id } = req.params;
    await vaccinationService.update(id, req.body);
    res.json({ message: 'Vaccination record updated' });
  },
  async delete(req: Request, res: Response) {
    await checkPermission(req, 'vaccination:record');
    const { id } = req.params;
    await vaccinationService.delete(id);
    res.json({ message: 'Vaccination record deleted' });
  },
};
