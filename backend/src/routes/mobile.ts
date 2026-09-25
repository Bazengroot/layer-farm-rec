// backend/src/routes/mobile.ts

import { Router } from 'express';
import { getNotifications, markNotificationRead, syncOfflineQueue } from '../controllers/mobileController';

const router = Router();

router.get('/notifications', getNotifications);
router.patch('/notifications/:id/read', markNotificationRead);
router.post('/sync', syncOfflineQueue);

export const mobileRouter = router;
