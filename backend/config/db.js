/**
 * MongoDB Atlas Connection — Adyapan Backend
 *
 * Uses Mongoose to connect to MongoDB Atlas.
 * - Reads MONGO_URI from environment variables (never hardcoded)
 * - Prevents duplicate connections (safe to call multiple times)
 * - Handles Windows DNS/IPv6 quirks with fallback options
 * - Works on localhost, Vercel, Render, Railway
 */

const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  // Prevent duplicate connections (important for serverless/hot-reload)
  if (isConnected) {
    console.log('[DB] ♻️  Reusing existing MongoDB connection');
    return;
  }

  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!uri) {
    console.error('[DB] ❌ MONGO_URI is not defined in environment variables');
    console.error('[DB]    Add MONGO_URI=mongodb+srv://... to backend/.env');
    process.exit(1);
  }

  // Connection options
  // Note: Do NOT pass 'family' option — not supported in mongoose 8.x
  // Use direct (non-SRV) URI if querySrv fails on Windows
  const options = {
    dbName: process.env.DB_NAME || 'adyapan',
    serverSelectionTimeoutMS: 15000,
    socketTimeoutMS: 45000,
  };

  try {
    console.log('[DB] 🔄 Connecting to MongoDB Atlas...');
    const conn = await mongoose.connect(uri, options);

    isConnected = true;

    console.log(`[DB] ✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    console.log(`[DB]    Database : ${conn.connection.name}`);
    console.log(`[DB]    State    : ready`);

    // Handle connection events
    mongoose.connection.on('disconnected', () => {
      console.warn('[DB] ⚠️  MongoDB disconnected — reconnecting...');
      isConnected = false;
    });
    mongoose.connection.on('reconnected', () => {
      console.log('[DB] ✅ MongoDB reconnected');
      isConnected = true;
    });
    mongoose.connection.on('error', (err) => {
      console.error('[DB] ❌ MongoDB error:', err.message);
      isConnected = false;
    });

  } catch (error) {
    console.error('[DB] ❌ MongoDB connection failed:', error.message);
    console.error('[DB]    Troubleshooting:');
    console.error('[DB]    1. Atlas Network Access → Add 0.0.0.0/0 (allow all IPs)');
    console.error('[DB]    2. Check MONGO_URI in backend/.env');
    console.error('[DB]    3. Verify Atlas cluster is not paused');
    console.error('[DB]    4. Try mobile hotspot if corporate network blocks port 27017');
    process.exit(1);
  }
};

module.exports = connectDB;
