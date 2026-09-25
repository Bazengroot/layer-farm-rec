"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
class AppError extends Error {
    statusCode;
    code;
    isOperational;
    details;
    constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', isOperational = true, details) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = isOperational;
        this.details = details;
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
    static badRequest(message, code = 'BAD_REQUEST', details) {
        return new AppError(message, 400, code, true, details);
    }
    static unauthorized(message = 'Unauthorized', code = 'UNAUTHORIZED') {
        return new AppError(message, 401, code, true);
    }
    static forbidden(message = 'Forbidden', code = 'FORBIDDEN') {
        return new AppError(message, 403, code, true);
    }
    static notFound(message = 'Resource not found', code = 'NOT_FOUND') {
        return new AppError(message, 404, code, true);
    }
    static conflict(message, code = 'CONFLICT') {
        return new AppError(message, 409, code, true);
    }
    static internal(message = 'Internal server error', code = 'INTERNAL_ERROR') {
        return new AppError(message, 500, code, false);
    }
}
exports.AppError = AppError;
//# sourceMappingURL=AppError.js.map