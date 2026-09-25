import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // If response has already sent headers, delegate to default Express handler
  if (res.headersSent) {
    return next(err);
  }

  // Handle known AppError
  if (err instanceof AppError) {
    logger.warn(`AppError [${err.code}]: ${err.message}`, {
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
  logger.error(`Unhandled Error: ${err.message || err}`, {
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
