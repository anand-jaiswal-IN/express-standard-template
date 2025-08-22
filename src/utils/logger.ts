import type { TransformableInfo } from 'logform';

import winston, { format, Logger } from 'winston';
import 'winston-daily-rotate-file';

// Extract winston format helpers
const { align, colorize, combine, errors, json, printf, timestamp } = format;

// ----------------------------
// Custom format for console output
// ----------------------------
const consoleFormat = combine(
  colorize({ all: true }),
  timestamp({
    format: 'YYYY-MM-DD hh:mm:ss.SSS A',
  }),
  align(),
  printf((info: TransformableInfo): string => {
    // Safely handle optional fields
    const msg = typeof info.message === 'string' ? info.message : JSON.stringify(info.message);
    return `[${info.timestamp as string}] ${info.level}: ${msg}`;
  })
);

// ----------------------------
// Custom format for file output (structured JSON)
// ----------------------------
const fileFormat = combine(timestamp(), errors({ stack: true }), json());

// ----------------------------
// Rotating file transport for all logs
// ----------------------------
const fileRotateTransport = new winston.transports.DailyRotateFile({
  datePattern: 'YYYY-MM-DD',
  filename: 'logs/combined-%DATE%.log',
  format: fileFormat,
  maxFiles: '14d',
  maxSize: '20m',
});

// ----------------------------
// Rotating file transport for error logs only
// ----------------------------
const errorFileRotateTransport = new winston.transports.DailyRotateFile({
  datePattern: 'YYYY-MM-DD',
  filename: 'logs/error-%DATE%.log',
  format: fileFormat,
  level: 'error',
  maxFiles: '30d',
  maxSize: '20m',
});

// ----------------------------
// Main logger instance
// ----------------------------
const logger: Logger = winston.createLogger({
  defaultMeta: {
    environment: process.env.NODE_ENV ?? 'development',
    service: process.env.SERVICE_NAME ?? 'express-app',
  },
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exceptions.log' }),
    new winston.transports.Console(),
  ],
  level: process.env.LOG_LEVEL ?? 'info',
  rejectionHandlers: [
    new winston.transports.File({ filename: 'logs/rejections.log' }),
    new winston.transports.Console(),
  ],
  transports: [
    new winston.transports.Console({
      format: process.env.NODE_ENV === 'production' ? fileFormat : consoleFormat,
    }),
    fileRotateTransport,
    errorFileRotateTransport,
  ],
});

// ----------------------------
// Stream for Morgan integration
// ----------------------------
const stream = {
  write: (message: string): void => {
    logger.http(message.trim());
  },
};

export { logger, stream };
export default logger;
