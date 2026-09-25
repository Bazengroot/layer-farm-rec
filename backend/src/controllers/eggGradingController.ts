// backend/src/controllers/eggGradingController.ts

import { Request, Response } from 'express';
import { eggGradingService } from '../services/eggGradingService';
import { checkPermission } from '../middleware/permissionMiddleware';

/**
 * Controller for egg grading operations.
 * All endpoints are protected by permission checks.
 */
export const eggGradingController = {
  async createBatch(req: Request, res: Response) {
    try {
      await checkPermission(req, 'manage_egg');
      const batch = await eggGradingService.createBatch(req.body);
      res.status(201).json(batch);
    } catch (err: any) {
      console.error('Error creating grading batch', err);
      res.status(err.status || 500).json({ error: err.message });
    }
  },

  async listBatches(req: Request, res: Response) {
    try {
      await checkPermission(req, 'view_egg');
      const batches = await eggGradingService.listBatches(req.query as any);
      res.json(batches);
    } catch (err: any) {
      console.error('Error listing grading batches', err);
      res.status(err.status || 500).json({ error: err.message });
    }
  },

  async updateBatch(req: Request, res: Response) {
    try {
      await checkPermission(req, 'manage_egg');
      const { batchId } = req.params;
      const result = await eggGradingService.updateBatch(batchId, req.body);
      res.json(result);
    } catch (err: any) {
      console.error('Error updating grading batch', err);
      res.status(err.status || 500).json({ error: err.message });
    }
  },
};
