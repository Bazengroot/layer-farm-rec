"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const AppError_1 = require("../utils/AppError");
const logger_1 = require("../utils/logger");
const errorHandler = (err, req, res, next) => {
    // If response has already sent headers, delegate to default Express handler
    if (res.headersSent) {
        return next(err);
    }
    // Handle known AppError
    if (err instanceof AppError_1.AppError) {
        logger_1.logger.warn(`AppError [${err.code}]: ${err.message}`, {
            path: req.originalUrl,
            method: req.method,
            statusCode: err.statusCode,
            details: err.details,
        });
        return res.status(err.statusCode).json({
            success: false,
            error: {
                code: err.code,
                message: err.message,
                ...(err.details && { details: err.details }),
            },
            timestamp: new Date().toISOString(),
        });
    }
    // Handle Body-parser / JSON Syntax Errors
    if (err.type === 'entity.parse.failed' || (err instanceof SyntaxError && 'body' in err)) {
        return res.status(400).json({
            success: false,
            error: {
                code: 'INVALID_JSON',
                message: 'Malformed JSON payload provided',
            },
            timestamp: new Date().toISOString(),
        });
    }
    // Handle unknown / unhandled internal errors
    logger_1.logger.error(`Unhandled Error: ${err.message || err}`, {
        path: req.originalUrl,
        method: req.method,
        stack: err.stack,
    });
    const isProduction = process.env.NODE_ENV === 'production';
    return res.status(500).json({
        success: false,
        error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: isProduction ? 'An unexpected server error occurred' : err.message || 'Internal server error',
            ...(!isProduction && { stack: err.stack }),
        },
        timestamp: new Date().toISOString(),
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map