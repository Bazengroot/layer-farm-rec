// backend/src/controllers/performanceController.ts

import { Request, Response } from 'express';
import { performanceService } from '../services/performanceKPIService';

/**
 * GET /api/performance/kpis?flockId=...&startDate=...&endDate=...
 * Returns all calculated KPIs for the specified flock and date range.
 */
export const getFlockKPIs = async (req: Request, res: Response) => {
  try {
    const { flockId, startDate, endDate } = req.query as any;
    if (!flockId || !startDate || !endDate) {
      return res.status(400).json({ error: 'Missing required query parameters: flockId, startDate, endDate' });
    }
    const result = await performanceService.computeFlockKPIs(flockId, startDate, endDate);
    return res.status(200).json(result);
  } catch (err: any) {
    console.error('Error computing KPIs', err);
    return res.status(500).json({ error: err.message ?? 'Internal server error' });
  }
};
