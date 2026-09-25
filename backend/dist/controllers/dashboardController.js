"use strict";
// backend/src/controllers/dashboardController.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBODDashboard = exports.getInventoryDashboard = exports.getVetDashboard = exports.getSiteManagerDashboard = exports.getFarmManagerDashboard = void 0;
const dashboardService_1 = require("../services/dashboardService");
const getFarmManagerDashboard = async (req, res) => {
    try {
        const { farmId } = req.query;
        const data = await dashboardService_1.dashboardService.getFarmManagerDashboard(farmId);
        return res.status(200).json(data);
    }
    catch (err) {
        console.error('Error fetching farm manager dashboard', err);
        return res.status(500).json({ error: err.message || 'Server error' });
    }
};
exports.getFarmManagerDashboard = getFarmManagerDashboard;
const getSiteManagerDashboard = async (req, res) => {
    try {
        const { siteId } = req.query;
        const data = await dashboardService_1.dashboardService.getSiteManagerDashboard(siteId);
        return res.status(200).json(data);
    }
    catch (err) {
        console.error('Error fetching site manager dashboard', err);
        return res.status(500).json({ error: err.message || 'Server error' });
    }
};
exports.getSiteManagerDashboard = getSiteManagerDashboard;
const getVetDashboard = async (_req, res) => {
    try {
        const data = await dashboardService_1.dashboardService.getVetDashboard();
        return res.status(200).json(data);
    }
    catch (err) {
        console.error('Error fetching vet dashboard', err);
        return res.status(500).json({ error: err.message || 'Server error' });
    }
};
exports.getVetDashboard = getVetDashboard;
const getInventoryDashboard = async (_req, res) => {
    try {
        const data = await dashboardService_1.dashboardService.getInventoryDashboard();
        return res.status(200).json(data);
    }
    catch (err) {
        console.error('Error fetching inventory dashboard', err);
        return res.status(500).json({ error: err.message || 'Server error' });
    }
};
exports.getInventoryDashboard = getInventoryDashboard;
const getBODDashboard = async (_req, res) => {
    try {
        const data = await dashboardService_1.dashboardService.getBODDashboard();
        return res.status(200).json(data);
    }
    catch (err) {
        console.error('Error fetching BOD dashboard', err);
        return res.status(500).json({ error: err.message || 'Server error' });
    }
};
exports.getBODDashboard = getBODDashboard;
//# sourceMappingURL=dashboardController.js.map