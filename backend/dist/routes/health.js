"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthRouter = void 0;
const express_1 = require("express");
const dailyHealth_1 = require("../routes/dailyHealth");
const medication_1 = require("../routes/medication");
const vaccination_1 = require("../routes/vaccination");
exports.healthRouter = (0, express_1.Router)();
// Mount sub‑routers
exports.healthRouter.use('/daily', dailyHealth_1.dailyHealthRouter);
exports.healthRouter.use('/medication', medication_1.medicationRouter);
exports.healthRouter.use('/vaccination', vaccination_1.vaccinationRouter);
exports.healthRouter.get('/', async (_req, res) => {
    const isDbConfigured = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY);
    return res.status(200).json({
        status: 'ok',
        service: 'lfrms-backend',
        version: '0.1.0',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        uptime: process.uptime(),
        database: {
            configured: isDbConfigured,
            provider: 'Supabase PostgreSQL',
        },
    });
});
//# sourceMappingURL=health.js.map