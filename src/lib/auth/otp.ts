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
  if (!/^\d{6}$/.test(otp) || typeof storedHash !== "string" || !/^v1:[a-f0-9]{64}$/.test(storedHash)) return false;
  const expected = hashOtp(email, otp);
  try {
    return crypto.timingSafeEqual(Buffer.from(expected, "utf8"), Buffer.from(storedHash, "utf8"));
  } catch {
    return false;
  }
}
