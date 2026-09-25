"use strict";
// backend/src/controllers/mobileController.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncOfflineQueue = exports.markNotificationRead = exports.getNotifications = void 0;
const notificationService_1 = require("../services/notificationService");
const offlineSyncService_1 = require("../services/offlineSyncService");
// --- NOTIFICATIONS ---
const getNotifications = async (req, res) => {
    try {
        const { userId } = req.query;
        const notifications = await notificationService_1.notificationService.getUserNotifications(userId);
        return res.status(200).json(notifications);
    }
    catch (err) {
        return res.status(500).json({ error: err.message || 'Server error' });
    }
};
exports.getNotifications = getNotifications;
const markNotificationRead = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await notificationService_1.notificationService.markAsRead(id);
        return res.status(200).json(result);
    }
    catch (err) {
        return res.status(500).json({ error: err.message || 'Server error' });
    }
};
exports.markNotificationRead = markNotificationRead;
// --- OFFLINE SYNC ---
const syncOfflineQueue = async (req, res) => {
    try {
        const { items } = req.body;
        if (!Array.isArray(items)) {
            return res.status(400).json({ error: 'Payload must include an items array' });
        }
        const results = await offlineSyncService_1.offlineSyncService.processSyncQueue(items);
        return res.status(200).json({ results });
    }
    catch (err) {
        return res.status(500).json({ error: err.message || 'Server error' });
    }
};
exports.syncOfflineQueue = syncOfflineQueue;
//# sourceMappingURL=mobileController.js.map