import mongoose, { type Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable.");
}

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Extend global to cache the connection across Next.js hot-reloads (dev)
// and across serverless function invocations (prod).
declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: MongooseCache;
}

const cache: MongooseCache = global._mongooseCache ?? {
  conn: null,
  promise: null,
};

if (!global._mongooseCache) {
  global._mongooseCache = cache;
}

export async function connectDB(): Promise<Mongoose> {
  // Return already-established connection immediately
  if (cache.conn) return cache.conn;

  // If a connection attempt is already in-flight, await it instead of starting
  // a second one (prevents duplicate connections during parallel requests)
  if (!cache.promise) {
    cache.promise = mongoose
      .connect(MONGODB_URI as string, {
        bufferCommands: false, // fail fast if not connected — don't queue ops
      })
      .then((m) => m);
  }

  cache.conn = await cache.promise;
  return cache.conn;
}
