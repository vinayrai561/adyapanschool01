/**
 * MongoDB Atlas Connection — Next.js Frontend
 *
 * Singleton pattern for Next.js — reuses connection across hot reloads.
 * Uses MONGODB_URI from environment variables (never hardcoded).
 * Works on localhost, Vercel, Render, Railway.
 */

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    '[MongoDB] MONGODB_URI is not defined. Add it to your .env file.'
  );
}

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// Preserve connection across Next.js hot reloads in development
const globalForMongoose = global as typeof globalThis & {
  mongoose?: MongooseCache;
};

const cached: MongooseCache = globalForMongoose.mongoose ?? {
  conn: null,
  promise: null,
};

export async function connectToDatabase(): Promise<typeof mongoose> {
  // Return existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Create new connection promise if none exists
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI as string, {
        dbName: process.env.DB_NAME || 'adyapan',
        serverSelectionTimeoutMS: 15000,
        socketTimeoutMS: 45000,
        bufferCommands: false,
      })
      .then((m) => {
        console.log('[MongoDB] ✅ Connected to Atlas:', m.connection.host);
        return m;
      })
      .catch((err) => {
        cached.promise = null; // Reset so next call retries
        console.error('[MongoDB] ❌ Connection failed:', err.message);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  globalForMongoose.mongoose = cached;
  return cached.conn;
}
