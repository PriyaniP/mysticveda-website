import mongoose from "mongoose";

// Cache the connection across serverless invocations (Vercel) so we don't open
// a new MongoDB connection on every request and exhaust the pool.
let cached = global.__mysticvedaMongoose;
if (!cached) {
  cached = global.__mysticvedaMongoose = { conn: null, promise: null };
}

export async function connectDatabase() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.warn(
      "MONGODB_URI is not configured. Falling back to local JSON storage."
    );
    return false;
  }

  // Already connected in this (warm) instance.
  if (cached.conn) {
    return true;
  }

  try {
    if (!cached.promise) {
      cached.promise = mongoose
        .connect(mongoUri, {
          serverSelectionTimeoutMS: 5000,
          bufferCommands: false
        })
        .then((mongooseInstance) => mongooseInstance);
    }

    cached.conn = await cached.promise;
    console.info("Connected to MongoDB");
    return true;
  } catch (error) {
    cached.promise = null;
    console.warn(
      `MongoDB connection failed. Using local JSON storage instead. ${error.message}`
    );
    return false;
  }
}
