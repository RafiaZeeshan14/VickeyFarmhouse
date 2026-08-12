import dns from "dns";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

// Node's resolver can't do SRV lookups on some local networks even when the OS
// resolver can, which breaks mongodb+srv:// URIs with "querySrv ECONNREFUSED".
// Vercel resolves fine, so only local runs (dev server and prod builds) need it.
if (!process.env.VERCEL) {
  try {
    dns.setServers(["8.8.8.8", "1.1.1.1", ...dns.getServers()]);
  } catch {
    // best-effort only
  }
}

/**
 * Serverless functions spin up per request, so a naive mongoose.connect() would
 * open a new pool every time and exhaust the Atlas connection limit. The
 * connection promise is cached on globalThis, which survives warm invocations
 * (and hot reloads in dev).
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const globalForMongoose = globalThis as unknown as { _mongoose?: MongooseCache };

const cached: MongooseCache = globalForMongoose._mongoose || {
  conn: null,
  promise: null,
};
globalForMongoose._mongoose = cached;

export default async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is not set. Add it to .env.local (see .env.example)."
    );
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 10,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}
