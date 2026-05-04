const express    = require('express');
const cors       = require('cors');
const dotenv     = require('dotenv');
const connectDB  = require('./config/db');

// Load env vars — look for .env in project root first, then backend/
dotenv.config({ path: '../.env' });
dotenv.config(); // fallback: backend/.env

const userRoutes    = require('./src/routes/userRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app  = express();
const PORT = process.env.BACKEND_PORT || 5000;

/* ── Middleware ── */
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.NEXT_PUBLIC_APP_URL,
  ].filter(Boolean),
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ── Routes ── */
app.get('/api/health', (_req, res) => {
  res.json({
    status:    'ok',
    timestamp: new Date().toISOString(),
    service:   'Adyapan Backend',
  });
});

app.use('/api/users',   userRoutes);
app.use('/api/payment', paymentRoutes);

/* ── 404 handler ── */
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

/* ── Global error handler ── */
app.use((err, _req, res, _next) => {
  console.error('[Server] Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

/* ── Start ── */
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀 Adyapan Backend running on http://localhost:${PORT}`);
    console.log(`   Health: http://localhost:${PORT}/api/health`);
    console.log(`   Payment: POST http://localhost:${PORT}/api/payment/create-order`);
    console.log(`   Verify:  POST http://localhost:${PORT}/api/payment/verify-payment\n`);
  });
});
