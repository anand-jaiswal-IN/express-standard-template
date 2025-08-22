import type { Request, Response } from 'express';

import { logger } from '#utils/logger.js';
import morgan, { type TokenIndexer } from 'morgan';

interface ResponseWithError extends Response {
  errorMessage?: string;
}

// ------------------------------------------------------------
// Define custom tokens for detailed logging
// ------------------------------------------------------------
morgan.token('id', (req: Request): string => req.id);
morgan.token('body', (req: Request): string => JSON.stringify(req.body));
morgan.token(
  'error-message',
  (req: Request, res: ResponseWithError): string => res.errorMessage ?? ''
);

// ------------------------------------------------------------
// Format definitions
// ------------------------------------------------------------

// const developmentFormat = ':method :url :status :response-time ms - :res[content-length]';
const developmentFormat = (
  tokens: TokenIndexer<Request, Response>,
  req: Request,
  res: Response
): string => {
  return `${tokens.method(req, res) ?? 'UNKNOWN'} ${tokens.url(req, res) ?? 'UNKNOWN'} ${tokens.status(req, res) ?? 'UNKNOWN'} ${tokens['response-time'](req, res) ?? '0'} ms - ${tokens.res(req, res, 'content-length') ?? '0'}`;
};

const productionFormat = (
  tokens: TokenIndexer<Request, Response>,
  req: Request,
  res: Response
): string => {
  const errorMsg = tokens['error-message'](req, res);

  return JSON.stringify({
    content_length: tokens.res(req, res, 'content-length'),
    method: tokens.method(req, res),
    remote_addr: tokens['remote-addr'](req, res),
    response_time: Number.parseFloat(tokens['response-time'](req, res) ?? '0'),
    status: Number.parseFloat(tokens.status(req, res) ?? '0'),
    timestamp: new Date().toISOString(),
    url: tokens.url(req, res),
    user_agent: tokens['user-agent'](req, res),
    ...(errorMsg && { error_message: errorMsg }),
  });
};

// ------------------------------------------------------------
// Create Morgan middleware
// ------------------------------------------------------------

const format = (tokens: TokenIndexer<Request, Response>, req: Request, res: Response): string => {
  if (process.env.NODE_ENV === 'production') {
    return productionFormat(tokens, req, res);
  } else {
    return developmentFormat(tokens, req, res);
  }
};

const morganMiddleware = morgan<Request, Response>(format, {
  skip: (req: Request): boolean =>
    process.env.NODE_ENV === 'production' && req.originalUrl === '/health',
  stream: {
    write: (message: string): void => {
      if (process.env.NODE_ENV === 'production') {
        try {
          const data = JSON.parse(message) as Record<string, unknown>;
          logger.http('incoming-request', data);
        } catch {
          logger.http(message.trim());
        }
      } else {
        logger.http(message.trim());
      }
    },
  },
});

export default morganMiddleware;
