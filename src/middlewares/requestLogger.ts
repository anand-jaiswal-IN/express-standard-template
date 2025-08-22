import type { NextFunction, Request, Response } from 'express';

import { logger } from '#utils/logger.js';
import { v4 as uuidv4 } from 'uuid';

// ------------------------------------------------------------
// Request ID + Context Logger Middleware
// ------------------------------------------------------------
export const requestLoggerMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  // Generate unique request ID & start time
  req.id = uuidv4();
  req.startTime = Date.now();

  // Create child logger with request context
  req.logger = logger.child({
    ip: req.ip ?? '',
    method: req.method,
    requestId: req.id,
    url: req.originalUrl,
    userAgent: req.get('User-Agent'),
  });

  // Log incoming request
  req.logger.info('Incoming request', {
    headers: req.headers,
    query: req.query,
    ...(req.body && typeof req.body === 'object' && Object.keys(req.body as object).length > 0
      ? { body: req.body as object }
      : {}),
  });

  // ------------------------------------------------------------
  // Override res.json to log response payload size + status
  // ------------------------------------------------------------
  const originalJson = res.json.bind(res);

  res.json = function <T>(body: T): Response<T> {
    const responseTime = Date.now() - req.startTime;

    req.logger.info('Outgoing response', {
      contentLength: JSON.stringify(body).length,
      responseTime: `${responseTime.toString()}ms`,
      statusCode: res.statusCode,
    });

    return originalJson(body);
  };

  // ------------------------------------------------------------
  // Override res.status to log warnings for error responses
  // ------------------------------------------------------------
  const originalStatus = res.status.bind(res);

  res.status = function (code: number): Response {
    if (code >= 400) {
      req.logger.warn(`HTTP ${code.toString()} response`);
    }
    return originalStatus(code);
  };

  next();
};
