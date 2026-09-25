// backend/src/controllers/dashboardController.ts

import { Request, Response } from 'express';
import { dashboardService } from '../services/dashboardService';

export const getFarmManagerDashboard = async (req: Request, res: Response) => {
  try {
    const { farmId } = req.query as any;
    const data = await dashboardService.getFarmManagerDashboard(farmId);
    return res.status(200).json(data);
  } catch (err: any) {
    console.error('Error fetching farm manager dashboard', err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};

export const getSiteManagerDashboard = async (req: Request, res: Response) => {
  try {
    const { siteId } = req.query as any;
    const data = await dashboardService.getSiteManagerDashboard(siteId);
    return res.status(200).json(data);
  } catch (err: any) {
    console.error('Error fetching site manager dashboard', err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};

export const getVetDashboard = async (_req: Request, res: Response) => {
  try {
    const data = await dashboardService.getVetDashboard();
    return res.status(200).json(data);
  } catch (err: any) {
    console.error('Error fetching vet dashboard', err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};

export const getInventoryDashboard = async (_req: Request, res: Response) => {
  try {
    const data = await dashboardService.getInventoryDashboard();
    return res.status(200).json(data);
  } catch (err: any) {
    console.error('Error fetching inventory dashboard', err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};

export const getBODDashboard = async (_req: Request, res: Response) => {
  try {
    const data = await dashboardService.getBODDashboard();
    return res.status(200).json(data);
  } catch (err: any) {
    console.error('Error fetching BOD dashboard', err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};
