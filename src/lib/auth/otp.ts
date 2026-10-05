import crypto from "crypto";

import { serverEnv } from "@/lib/env.server";

export function generateOtp(): string {
  const min = 100000;
  const max = 999999;
  const range = max - min + 1;
  const value = min + crypto.randomInt(0, range);
  return String(value);
}

export function hashOtp(email: string, otp: string): string {
  return `v1:${crypto.createHmac("sha256", serverEnv.OTP_SECRET).update(`${email.toLowerCase().trim()}:${otp}`).digest("hex")}`;
}

export function verifyOtp(email: string, otp: string, storedHash: string): boolean {
  const expected = hashOtp(email, otp);
  try {
    return crypto.timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(storedHash, "hex"));
  } catch {
    return false;
  }
}
