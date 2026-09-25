"use strict";
// backend/src/controllers/reportController.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGenericReport = exports.getDailyFlockReport = void 0;
const reportService_1 = require("../services/reportService");
const getDailyFlockReport = async (req, res) => {
    try {
        const { flockId, date } = req.query;
        if (!flockId || !date) {
            return res.status(400).json({ error: 'Missing required query parameters: flockId, date' });
        }
        const data = await reportService_1.reportService.getDailyFlockReport(flockId, date);
        return res.status(200).json(data);
    }
    catch (err) {
        console.error('Error fetching daily flock report', err);
        return res.status(500).json({ error: err.message || 'Server error' });
    }
};
exports.getDailyFlockReport = getDailyFlockReport;
const getGenericReport = async (req, res) => {
    try {
        const { type, flockId, farmId, startDate, endDate } = req.query;
        if (!type) {
            return res.status(400).json({ error: 'Missing required query parameter: type' });
        }
        const data = await reportService_1.reportService.getReportData(type, flockId, farmId, startDate, endDate);
        return res.status(200).json(data);
    }
    catch (err) {
        console.error('Error generating report data', err);
        return res.status(500).json({ error: err.message || 'Server error' });
    }
};
exports.getGenericReport = getGenericReport;
//# sourceMappingURL=reportController.js.map