// backend/src/controllers/mobileController.ts

import { Request, Response } from 'express';
import { notificationService } from '../services/notificationService';
import { offlineSyncService } from '../services/offlineSyncService';

// --- NOTIFICATIONS ---
export const getNotifications = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query as any;
    const notifications = await notificationService.getUserNotifications(userId);
    return res.status(200).json(notifications);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};

export const markNotificationRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await notificationService.markAsRead(id);
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};

// --- OFFLINE SYNC ---
export const syncOfflineQueue = async (req: Request, res: Response) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'Payload must include an items array' });
    }
    const results = await offlineSyncService.processSyncQueue(items);
    return res.status(200).json({ results });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};
