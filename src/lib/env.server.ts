import { z } from "zod";

const envSchema = z.object({
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  MONGODB_DB_NAME: z.string().min(1).default("dovia"),

  AUTH_SECRET: z.string().min(1, "AUTH_SECRET is required"),
  OTP_SECRET: z.string().min(1, "OTP_SECRET is required"),
  ENCRYPTION_KEY: z.string().min(1, "ENCRYPTION_KEY is required"),

  APP_URL: z.string().min(1, "APP_URL is required"),
  NEXT_PUBLIC_APP_URL: z.string().min(1, "NEXT_PUBLIC_APP_URL is required"),

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

  AUTH_SECRET: process.env.AUTH_SECRET,
  OTP_SECRET: process.env.OTP_SECRET,
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,

  APP_URL: process.env.APP_URL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,

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
