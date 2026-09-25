// backend/src/controllers/dailyHealthController.ts

import { Request, Response } from 'express';
import { checkPermission } from '../middleware/permissionMiddleware';
import { dailyHealthService } from '../services/dailyHealthService';

/**
 * Controller for daily health record endpoints.
 * Permissions:
 *   - health:view   => list records (GET /api/health/daily)
 *   - health:record => create record (POST)
 *   - health:record => update record (PUT /:id)
 *   - health:record => delete record (DELETE /:id)
 */
export const dailyHealthController = {
  async list(req: Request, res: Response) {
    const orgId = req.user.organization_id;
    await checkPermission(req, 'health:view');
    const data = await dailyHealthService.list(orgId);
    res.json(data);
  },
  async create(req: Request, res: Response) {
    const orgId = req.user.organization_id;
    await checkPermission(req, 'health:record');
    await dailyHealthService.create(orgId, req.body);
    res.status(201).json({ message: 'Daily health record created' });
  },
  async update(req: Request, res: Response) {
    await checkPermission(req, 'health:record');
    const { id } = req.params;
    await dailyHealthService.update(id, req.body);
    res.json({ message: 'Daily health record updated' });
  },
  async delete(req: Request, res: Response) {
    await checkPermission(req, 'health:record');
    const { id } = req.params;
    await dailyHealthService.delete(id);
    res.json({ message: 'Daily health record deleted' });
  },
};
