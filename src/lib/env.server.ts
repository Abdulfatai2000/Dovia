import { z } from "zod";

const envSchema = z.object({
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  MONGODB_DB_NAME: z.string().min(1).default("dovia"),

  SMTP_HOST: z.string().min(1, "SMTP_HOST is required"),
  SMTP_PORT: z.coerce.number().int().positive().default(465),
  SMTP_USER: z.string().email().min(1, "SMTP_USER must be a valid email"),
  SMTP_APP_PASSWORD: z.string().min(1, "SMTP_APP_PASSWORD is required"),
  EMAIL_FROM_NAME: z.string().min(1).default("Dovia"),
  EMAIL_FROM_ADDRESS: z.string().email().optional().or(z.literal("")),
});

const parsed = envSchema.safeParse({
  MONGODB_URI: process.env.MONGODB_URI,
  MONGODB_DB_NAME: process.env.MONGODB_DB_NAME,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_APP_PASSWORD: process.env.SMTP_APP_PASSWORD,
  EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME,
  EMAIL_FROM_ADDRESS: process.env.EMAIL_FROM_ADDRESS,
});

if (!parsed.success) {
  const message = parsed.error.issues.map(issue => issue.message).join("; ");
  throw new Error(`Server environment validation failed: ${message}`);
}

export const serverEnv = parsed.data;
