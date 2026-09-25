// backend/src/controllers/eggQualityController.ts

import { Request, Response } from 'express';
import { eggQualityService } from '../services/eggQualityService';
import { checkPermission } from '../middleware/permissionMiddleware';

export const eggQualityController = {
  async create(req: Request, res: Response) {
    try {
      await checkPermission(req, 'egg:quality:test');
      const record = await eggQualityService.create(req.body);
      res.status(201).json(record);
    } catch (err: any) {
      console.error('Error creating quality record', err);
      res.status(err.status || 500).json({ error: err.message });
    }
  },

  async list(req: Request, res: Response) {
    try {
      await checkPermission(req, 'egg:view');
      const records = await eggQualityService.list(req.query as any);
      res.json(records);
    } catch (err: any) {
      console.error('Error listing quality records', err);
      res.status(err.status || 500).json({ error: err.message });
    }
  },
};
