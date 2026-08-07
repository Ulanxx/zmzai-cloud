import mongoose from "mongoose";

import { getServerEnv } from "@/config/env";

interface MongooseCache { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null; }
declare global { var zmzaiCloudMongooseCache: MongooseCache | undefined; }

const cache: MongooseCache = global.zmzaiCloudMongooseCache ?? { conn: null, promise: null };
if (process.env.NODE_ENV !== "production") global.zmzaiCloudMongooseCache = cache;

export async function connectMongo(): Promise<typeof mongoose> {
  if (cache.conn) return cache.conn;
  cache.promise ??= mongoose.connect(getServerEnv().MONGODB_URI, { bufferCommands: false, serverSelectionTimeoutMS: 5000 }).catch((error) => { cache.promise = null; throw error; });
  cache.conn = await cache.promise;
  return cache.conn;
}
