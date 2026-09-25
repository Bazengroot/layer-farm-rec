"use strict";
// backend/src/controllers/performanceController.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFlockKPIs = void 0;
const performanceKPIService_1 = require("../services/performanceKPIService");
/**
 * GET /api/performance/kpis?flockId=...&startDate=...&endDate=...
 * Returns all calculated KPIs for the specified flock and date range.
 */
const getFlockKPIs = async (req, res) => {
    try {
        const { flockId, startDate, endDate } = req.query;
        if (!flockId || !startDate || !endDate) {
            return res.status(400).json({ error: 'Missing required query parameters: flockId, startDate, endDate' });
        }
        const result = await performanceKPIService_1.performanceService.computeFlockKPIs(flockId, startDate, endDate);
        return res.status(200).json(result);
    }
    catch (err) {
        console.error('Error computing KPIs', err);
        return res.status(500).json({ error: err.message ?? 'Internal server error' });
    }
};
exports.getFlockKPIs = getFlockKPIs;
//# sourceMappingURL=performanceController.js.map