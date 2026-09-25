// backend/src/controllers/eggDispatchController.ts

import { Request, Response } from 'express';
import { eggDispatchService } from '../services/eggDispatchService';
import { checkPermission } from '../middleware/permissionMiddleware';

export const eggDispatchController = {
  async createDraft(req: Request, res: Response) {
    try {
      await checkPermission(req, 'egg:inventory:manage');
      const draft = await eggDispatchService.createDraft(req.body);
      res.status(201).json(draft);
    } catch (err: any) {
      console.error('Error creating dispatch draft', err);
      res.status(err.status || 500).json({ error: err.message });
    }
  },

  async approve(req: Request, res: Response) {
    try {
      await checkPermission(req, 'egg:dispatch:approve');
      const { dispatchId } = req.params;
      const { approverProfileId } = req.body;
      const result = await eggDispatchService.approve(dispatchId, approverProfileId);
      res.json(result);
    } catch (err: any) {
      console.error('Error approving dispatch', err);
      res.status(err.status || 500).json({ error: err.message });
    }
  },

  async cancel(req: Request, res: Response) {
    try {
      await checkPermission(req, 'egg:dispatch:cancel');
      const { dispatchId } = req.params;
      const { cancellerProfileId } = req.body;
      const result = await eggDispatchService.cancel(dispatchId, cancellerProfileId);
      res.json(result);
    } catch (err: any) {
      console.error('Error cancelling dispatch', err);
      res.status(err.status || 500).json({ error: err.message });
    }
  },

  async list(req: Request, res: Response) {
    try {
      await checkPermission(req, 'egg:view');
      const dispatches = await eggDispatchService.list(req.query as any);
      res.json(dispatches);
    } catch (err: any) {
      console.error('Error listing dispatches', err);
      res.status(err.status || 500).json({ error: err.message });
    }
  },
};
