// backend/src/controllers/feedMasterController.ts

import { Request, Response } from 'express';
import { feedMasterService } from '../services/feedMasterService';
import { checkPermission } from '../middleware/permissionMiddleware';

/**
 * Controller for Feed Master Data (units, types, etc.).
 * Only a subset of CRUD operations are exposed here as examples.
 */
export const feedMasterController = {
  // ---- Units ----
  async createUnit(req: Request, res: Response) {
    try {
      await checkPermission(req, 'manage_feed_inventory');
      const unit = await feedMasterService.createUnit(req.body);
      res.status(201).json(unit);
    } catch (err: any) {
      console.error('Error creating feed unit', err);
      res.status(err.status || 500).json({ error: err.message });
    }
  },

  async listUnits(req: Request, res: Response) {
    try {
      await checkPermission(req, 'view_feed_reports');
      const { organizationId } = req.query as any;
      const units = await feedMasterService.listUnits(organizationId);
      res.json(units);
    } catch (err: any) {
      console.error('Error listing feed units', err);
      res.status(err.status || 500).json({ error: err.message });
    }
  },

  async updateUnit(req: Request, res: Response) {
    try {
      await checkPermission(req, 'manage_feed_inventory');
      const { id } = req.params;
      const result = await feedMasterService.updateUnit(id, req.body);
      res.json(result);
    } catch (err: any) {
      console.error('Error updating feed unit', err);
      res.status(err.status || 500).json({ error: err.message });
    }
  },

  async deleteUnit(req: Request, res: Response) {
    try {
      await checkPermission(req, 'manage_feed_inventory');
      const { id } = req.params;
      const result = await feedMasterService.deleteUnit(id);
      res.json(result);
    } catch (err: any) {
      console.error('Error deleting feed unit', err);
      res.status(err.status || 500).json({ error: err.message });
    }
  },

  // ---- Types (example: create only) ----
  async createType(req: Request, res: Response) {
    try {
      await checkPermission(req, 'manage_feed_inventory');
      const type = await feedMasterService.createType(req.body);
      res.status(201).json(type);
    } catch (err: any) {
      console.error('Error creating feed type', err);
      res.status(err.status || 500).json({ error: err.message });
    }
  },
};
