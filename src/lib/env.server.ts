import { z } from "zod";

const envSchema = z.object({
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  MONGODB_DB_NAME: z.string().min(1).default("dovia"),
});

const parsed = envSchema.safeParse({
  MONGODB_URI: process.env.MONGODB_URI,
  MONGODB_DB_NAME: process.env.MONGODB_DB_NAME,
});

if (!parsed.success) {
  const message = parsed.error.issues.map(issue => issue.message).join("; ");
  throw new Error(`Server environment validation failed: ${message}`);
}

export const serverEnv = parsed.data;
