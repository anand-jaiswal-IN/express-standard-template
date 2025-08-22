import { NextFunction, Request, Response } from 'express';

// Custom error interface
interface CustomError extends Error {
  isOperational?: boolean;
  statusCode?: number;
}

// Error handler middleware
export const errorHandler = (error: CustomError, req: Request, res: Response) => {
  const statusCode = error.statusCode ?? 500;
  const isOperational = error.isOperational ?? false;

  // Use request logger if available, otherwise use main logger
  const requestLogger = req.logger;
  // const requestLogger = req.logger || logger.child({ requestId: req.id || 'unknown' });

  // Log error with full context
  requestLogger.error('Request error', {
    error: {
      isOperational,
      message: error.message,
      name: error.name,
      stack: error.stack,
      statusCode,
    },
    request: {
      body: req.body as object,
      headers: req.headers,
      ip: req.ip ?? req.ip,
      method: req.method,
      query: req.query,
      url: req.originalUrl,
      userAgent: req.get('User-Agent'),
    },
  });

  // Set error message for Morgan
  res.errorMessage = error.message;

  // Send error response
  const errorResponse = {
    error: {
      message: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
      requestId: req.id,
    },
    timestamp: new Date().toISOString(),
  };

  res.status(statusCode).json(errorResponse);
};

// 404 Not Found handler
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error: CustomError = new Error(`Route ${req.originalUrl} not found`);
  error.statusCode = 404;
  error.isOperational = true;

  next(error);
};

export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
