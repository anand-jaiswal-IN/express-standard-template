import { asyncHandler, errorHandler, notFoundHandler } from '#middlewares/errorHandler.js';
import morganMiddleware from '#middlewares/morgan.js';
import { requestLoggerMiddleware } from '#middlewares/requestLogger.js';
import { logger } from '#utils/logger.js';
// import compression from 'compression';
// import cors from 'cors';
import express, { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
// import helmet from 'helmet';

// Create Express app
const app = express();

// Trust proxy (for accurate IP addresses in logs)
app.set('trust proxy', 1);

// Security middleware

// app.use(helmet());
// app.use(cors());
// app.use(compression());

// Rate limiting
const limiter = rateLimit({
  legacyHeaders: false,
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP',
  standardHeaders: true,
  windowMs: 15 * 60 * 1000, // 15 minutes
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware (order matters!)
app.use(morganMiddleware);
app.use(requestLoggerMiddleware);

// Health check endpoint (before request logging to avoid noise)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Example routes
app.get('/', (req, res) => {
  req.logger.info('Home route accessed');
  res.json({
    message: 'Welcome to the API',
    requestId: req.id,
  });
});

app.get(
  '/users',
  asyncHandler(async (req: Request, res: Response) => {
    req.logger.info('Fetching users');

    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 100));

    const users = [
      { email: 'john@example.com', id: 1, name: 'John Doe' },
      { email: 'jane@example.com', id: 2, name: 'Jane Smith' },
    ];

    req.logger.info(`Returning ${users.length.toString()} users`);
    res.json(users);
  })
);

app.get(
  '/error-test',
  asyncHandler((req: Request) => {
    req.logger.warn('Error test route accessed');

    // Simulate an error
    throw new Error('This is a test error');
  })
);

// Performance monitoring route
app.get('/profile-test', (req: Request, res: Response) => {
  // Start profiling
  const profiler = logger.startTimer();

  // Simulate some work
  const start = Date.now();
  while (Date.now() - start < 100) {
    // Busy wait for 100ms
  }

  // End profiling
  profiler.done({ level: 'info', message: 'Profile test completed' });

  res.json({ message: 'Profiling test completed' });
});

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Graceful shutdown handling
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Handle uncaught exceptions (Winston already configured for this)
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

export default app;
