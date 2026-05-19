/**
 * Adyapan Backend — Production-Ready Express Server
 *
 * Security stack:
 *   helmet          — HTTP security headers
 *   cors            — Strict origin whitelist
 *   express-rate-limit — DDoS / brute-force protection
 *   express-mongo-sanitize — NoSQL injection prevention
 *   cookie-parser   — httpOnly cookie support
 *   zod             — Request body validation
 *   bcrypt          — Password hashing (in User model)
 *   JWT             — Stateless auth with httpOnly cookies
 */

const express            = require('express');
const cors               = require('cors');
const helmet             = require('helmet');
const rateLimit          = require('express-rate-limit');
const mongoSanitize      = require('express-mongo-sanitize');
const cookieParser       = require('cookie-parser');
const dotenv             = require('dotenv');
const path               = require('path');
const connectDB          = require('./config/db');

// ── Load environment variables ────────────────────────────────
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });

// ── Validate critical env vars at startup ─────────────────────
const REQUIRED_ENV = ['JWT_SECRET', 'RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET'];
const missingEnv   = REQUIRED_ENV.filter(k => !process.env[k]);
if (!process.env.MONGODB_URI && !process.env.MONGO_URI) missingEnv.unshift('MONGODB_URI');
if (missingEnv.length > 0) {
  console.error(`[Server] ❌ Missing required env vars: ${missingEnv.join(', ')}`);
  if (process.env.NODE_ENV === 'production') process.exit(1);
  else console.warn('[Server] ⚠️  Continuing in dev mode with missing env vars');
}

// ── Pre-load all Mongoose models ──────────────────────────────
require('./models/index');

// ── Routes ────────────────────────────────────────────────────
const userRoutes           = require('./src/routes/userRoutes');
const paymentRoutes        = require('./routes/paymentRoutes');
const projectRequestRoutes = require('./routes/projectRequestRoutes');
const authRoutes           = require('./routes/authRoutes');
const courseRoutes         = require('./routes/courseRoutes');
const enrollmentRoutes     = require('./routes/enrollmentRoutes');
const adminRoutes          = require('./routes/adminRoutes');

const app  = express();
const PORT = process.env.BACKEND_PORT || 5000;
const isProd = process.env.NODE_ENV === 'production';

// ── Allowed CORS origins ──────────────────────────────────────
const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_APP_URL,
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
].filter(Boolean);

// ── 1. Security Headers (Helmet) ──────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc:  ["'self'"],
      scriptSrc:   ["'self'", "'unsafe-inline'", 'checkout.razorpay.com'],
      styleSrc:    ["'self'", "'unsafe-inline'"],
      imgSrc:      ["'self'", 'data:', 'https:'],
      connectSrc:  ["'self'", 'https://api.razorpay.com'],
      frameSrc:    ['https://api.razorpay.com'],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// ── 2. CORS — strict origin whitelist ────────────────────────
app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true); // Postman / server-to-server
    if (
      ALLOWED_ORIGINS.includes(origin) ||
      (!isProd && (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')))
    ) {
      return callback(null, true);
    }
    callback(new Error(`CORS: Origin ${origin} not allowed`));
  },
  credentials: true,
  methods:     ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// ── 3. Cookie Parser ──────────────────────────────────────────
app.use(cookieParser(process.env.COOKIE_SECRET || process.env.JWT_SECRET));

// ── 4. Body Parsers ───────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── 5. NoSQL Injection Prevention ────────────────────────────
app.use(mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`[Security] ⚠️  Sanitized key "${key}" from ${req.ip}`);
  },
}));

// ── 6. Global Rate Limiter ────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max:      200,
  standardHeaders: true,
  legacyHeaders:   false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', globalLimiter);

// ── 7. Strict Rate Limiters for sensitive routes ──────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      10,
  message:  { error: 'Too many auth attempts. Try again in 15 minutes.' },
  skipSuccessfulRequests: true,
});

const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max:      20,
  message:  { error: 'Too many payment requests. Try again later.' },
});

// Apply strict limiters
app.use('/api/auth/login',   authLimiter);
app.use('/api/auth/signup',  authLimiter);
app.use('/api/payment/',     paymentLimiter);

// ── 8. Request Logger (dev only) ─────────────────────────────
if (!isProd) {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// ── Health Check ──────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  const mongoose = require('mongoose');
  res.json({
    status:    'ok',
    timestamp: new Date().toISOString(),
    service:   'Adyapan Backend',
    version:   '2.0.0',
    database:  mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    env:       process.env.NODE_ENV || 'development',
  });
});

// ── API Routes ────────────────────────────────────────────────
app.use('/api/auth',            authRoutes);
app.use('/api/users',           userRoutes);
app.use('/api/payment',         paymentRoutes);
app.use('/api/project-request', projectRequestRoutes);
app.use('/api/courses',         courseRoutes);
app.use('/api/enrollments',     enrollmentRoutes);
app.use('/api/admin',           adminRoutes);

// ── 404 Handler ───────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Global Error Handler ──────────────────────────────────────
app.use((err, req, res, _next) => {
  // CORS errors
  if (err.message?.startsWith('CORS:')) {
    return res.status(403).json({ error: err.message });
  }
  // Zod validation errors (thrown from route handlers)
  if (err.name === 'ZodError') {
    return res.status(400).json({ error: 'Validation failed', details: err.errors });
  }
  // JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({ error: `${field} already exists` });
  }
  console.error(`[Server] ❌ ${req.method} ${req.path} — ${err.message}`);
  res.status(500).json({ error: isProd ? 'Internal server error' : err.message });
});

// ── Connect to MongoDB Atlas, then start server ───────────────
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🚀  Adyapan Backend v2.0 running on http://localhost:${PORT}`);
    console.log(`🔒  Security: helmet + cors + rate-limit + mongo-sanitize`);
    console.log(`🌍  Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  });
}).catch((err) => {
  console.error('[Server] ❌ Failed to start:', err.message);
  process.exit(1);
});
