import mongoose from "mongoose";

import { serverEnv } from "@/lib/env.server";

type Cached = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };

const globalKey = "__dovia__mongoose";
const cache = (globalThis as unknown as Record<string, Cached | undefined>)[globalKey] ??
  ((globalThis as unknown as Record<string, Cached>)[globalKey] = { conn: null, promise: null });

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    cache.promise = mongoose.connect(serverEnv.MONGODB_URI, {
      dbName: serverEnv.MONGODB_DB_NAME,
    }).then(m => m);
  }

  cache.conn = await cache.promise;
  return cache.conn;
}
