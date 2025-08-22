# Standard APIs

A production-ready Express.js API template with TypeScript, comprehensive middleware stack, and modern development tools.

## 🚀 Features

### Core Features

- **TypeScript** - Full type safety and modern JavaScript features
- **Express.js 5** - Latest Express framework with enhanced performance
- **ES Modules** - Native ES module support with import maps
- **Environment Management** - Multi-environment configuration support

### Security & Performance

- **Helmet** - Security headers and Content Security Policy
- **CORS** - Configurable Cross-Origin Resource Sharing
- **Rate Limiting** - Built-in request rate limiting (100 req/15min per IP)
- **Compression** - Response compression for better performance
- **Request Validation** - Built-in request size limits (10MB)

### Logging & Monitoring

- **Winston Logger** - Structured logging with daily rotation
- **Morgan HTTP Logger** - HTTP request logging with custom formats
- **Request Tracking** - Unique request IDs for traceability
- **Performance Profiling** - Built-in performance monitoring tools

### Development Experience

- **ESLint + Prettier** - Code quality and formatting
- **Vitest** - Fast unit testing with coverage
- **Husky + lint-staged** - Pre-commit hooks for code quality
- **Hot Reload** - Development server with file watching
- **Type Checking** - Separate type checking commands

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/anand-jaiswal-IN/express-standard-template
.git
cd express-standard-template


# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.development
```

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev                    # Start development server
npm run dev:testing           # Start with testing environment
npm run dev:staging           # Start with staging environment
npm run dev:prod              # Start with production environment

# Building
npm run build                 # Build for production
npm run build:check           # Type check build configuration

# Testing
npm run test                  # Run tests in watch mode
npm run test:run              # Run tests once
npm run test:ui               # Run tests with UI
npm run coverage              # Generate coverage report

# Code Quality
npm run type-check            # TypeScript type checking
npm run lint                  # ESLint checking
npm run lint:fix              # ESLint auto-fix
npm run format                # Prettier formatting
npm run format:check          # Prettier check only
```

### Environment Configuration

Create environment-specific files:

- `.env.development` - Development environment
- `.env.testing` - Testing environment
- `.env.staging` - Staging environment
- `.env.production` - Production environment

## 🌐 API Endpoints

### Health Check

```http
GET /health
```

Returns server status, timestamp, and uptime.

### Welcome

```http
GET /
```

Returns welcome message with request ID.

### Users

```http
GET /users
```

Returns a list of sample users (simulated async operation).

### Error Testing

```http
GET /error-test
```

Simulates an error for testing error handling.

### Performance Testing

```http
GET /profile-test
```

Performance profiling endpoint with built-in timing.

## 🏗️ Project Structure

```
src/
├── app.ts                    # Express application setup
├── server.ts                 # Server entry point
├── middlewares/
│   ├── errorHandler.ts       # Error handling middleware
│   ├── morgan.ts            # HTTP request logging
│   ├── requestLogger.ts     # Custom request logging
│   └── middlewares.ts       # Middleware exports
├── utils/
│   ├── logger.ts            # Winston logger configuration
│   └── sum.ts               # Utility functions
├── types/
│   └── express.d.ts         # Express type extensions
└── __tests__/
    └── sum.spec.ts          # Test files
```

## 🔧 Configuration

### Security Headers (Helmet)

- Content Security Policy with safe defaults
- XSS protection enabled
- Frame options for clickjacking protection

### CORS Configuration

- **Development**: Allows localhost origins
- **Production**: Configurable via `ALLOWED_ORIGINS` environment variable
- Supports credentials and common HTTP methods

### Rate Limiting

- 100 requests per 15 minutes per IP address
- Standard rate limit headers included

### Compression

- Level 6 compression (balanced performance)
- 1KB minimum threshold
- Skip compression with `x-no-compression` header

## 🧪 Testing

The project uses Vitest for testing with the following features:

- Fast execution with native ESM support
- Coverage reporting
- UI interface for test development
- ESLint integration

```bash
# Run tests
npm run test

# Run with coverage
npm run coverage
```

## 📝 Logging

### Log Levels

- **error** - Application errors
- **warn** - Warning messages
- **info** - General information
- **http** - HTTP requests (Morgan)
- **debug** - Debug information

### Log Format

- Structured JSON logging in production
- Human-readable format in development
- Daily log rotation
- Request ID tracking

## 🚀 Deployment

### Production Build

```bash
npm run build
npm start
```

### Environment Variables

Set the following for production:

- `NODE_ENV=production`
- `PORT` - Server port (default: 3000)
- `HOST` - Server host (default: localhost)
- `ALLOWED_ORIGINS` - Comma-separated list of allowed CORS origins

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

ISC License - see [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Anand Jaiswal**

- GitHub: [@anand-jaiswal-IN](https://github.com/anand-jaiswal-IN)
- Repository: [express-standard-template
  ](https://github.com/anand-jaiswal-IN/express-standard-template)
