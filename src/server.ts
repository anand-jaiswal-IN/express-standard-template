import app from '#app.js';
import { logger } from '#utils/logger.js';

const PORT = process.env.PORT ?? '3000';
const HOST = process.env.HOST ?? 'localhost';

// Start server
const server = app.listen(PORT, () => {
  logger.info(`Server running on ${HOST}:${PORT}`, {
    environment: process.env.NODE_ENV ?? 'development',
    nodeVersion: process.version,
    pid: process.pid,
    platform: process.platform,
  });
});

// Handle server errors
server.on('error', (error: Error) => {
  logger.error('Server error:', error);
  process.exit(1);
});

export default server;
