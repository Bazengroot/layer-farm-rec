"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const body_parser_1 = require("body-parser");
const routes_1 = __importDefault(require("./routes"));
const errorHandler_1 = require("./middleware/errorHandler");
const logger_1 = require("./utils/logger");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
// Security & utility middlewares
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
    credentials: true,
}));
app.use((0, express_rate_limit_1.default)({
    windowMs: 60_000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
}));
app.use((0, morgan_1.default)(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use((0, body_parser_1.json)({ limit: '10mb' }));
app.use((0, body_parser_1.urlencoded)({ extended: true, limit: '10mb' }));
// Root welcome route
app.get('/', (_req, res) => {
    res.json({
        name: 'Layer Farm Recording & Management System (LFRMS) API',
        version: '0.1.0',
        documentation: '/docs',
        health: '/api/health',
    });
});
// API routes
app.use('/api', routes_1.default);
// Global error handler
app.use(errorHandler_1.errorHandler);
const server = app.listen(PORT, () => {
    logger_1.logger.info(`LFRMS Backend server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});
// Graceful shutdown handling
const handleShutdown = (signal) => {
    logger_1.logger.info(`Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
        logger_1.logger.info('HTTP server closed. Exiting process.');
        process.exit(0);
    });
    setTimeout(() => {
        logger_1.logger.error('Forcefully terminating process after timeout.');
        process.exit(1);
    }, 10000);
};
process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));
exports.default = app;
//# sourceMappingURL=server.js.map