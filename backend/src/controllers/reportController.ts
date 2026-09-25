// backend/src/controllers/reportController.ts

import { Request, Response } from 'express';
import { reportService } from '../services/reportService';

export const getDailyFlockReport = async (req: Request, res: Response) => {
  try {
    const { flockId, date } = req.query as any;
    if (!flockId || !date) {
      return res.status(400).json({ error: 'Missing required query parameters: flockId, date' });
    }
    const data = await reportService.getDailyFlockReport(flockId, date);
    return res.status(200).json(data);
  } catch (err: any) {
    console.error('Error fetching daily flock report', err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};

export const getGenericReport = async (req: Request, res: Response) => {
  try {
    const { type, flockId, farmId, startDate, endDate } = req.query as any;
    if (!type) {
      return res.status(400).json({ error: 'Missing required query parameter: type' });
    }
    const data = await reportService.getReportData(type, flockId, farmId, startDate, endDate);
    return res.status(200).json(data);
  } catch (err: any) {
    console.error('Error generating report data', err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};
