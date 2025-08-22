import type { logger } from '#utils/logger.js';

declare module 'express-serve-static-core' {
  interface Request {
    id: string;
    logger: typeof logger;
    startTime: number;
  }
  interface Response {
    errorMessage?: string;
  }
}
