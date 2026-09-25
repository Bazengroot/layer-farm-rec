// backend/src/controllers/eggInventoryController.ts

import { Request, Response } from 'express';
import { eggInventoryService } from '../services/eggInventoryService';
import { checkPermission } from '../middleware/permissionMiddleware';

export const eggInventoryController = {
  async createTransaction(req: Request, res: Response) {
    try {
      await checkPermission(req, 'egg:inventory:manage');
      const transaction = await eggInventoryService.createTransaction(req.body);
      res.status(201).json(transaction);
    } catch (err: any) {
      console.error('Error creating inventory transaction', err);
      res.status(err.status || 500).json({ error: err.message });
    }
  },

  async getBalance(req: Request, res: Response) {
    try {
      await checkPermission(req, 'egg:inventory:manage');
      const balance = await eggInventoryService.getBalance(req.query as any);
      res.json(balance);
    } catch (err: any) {
      console.error('Error getting inventory balance', err);
      res.status(err.status || 500).json({ error: err.message });
    }
  },
};
