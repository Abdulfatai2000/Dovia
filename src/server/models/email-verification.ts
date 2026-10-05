import mongoose, { Schema } from "mongoose";
import crypto from "crypto";

import { EmailVerificationPurpose, OTP_MAX_ATTEMPTS } from "@/server/constants";

function verifyOtp(otp: string, otpHash: string): boolean {
  const [salt, expected] = otpHash.split(":");
  if (!salt || !expected) return false;
  const actual = crypto.createHmac("sha256", salt).update(otp).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(actual, "hex"));
  } catch {
    return false;
  }
}

const EmailVerificationSchema = new Schema(
  {
    emailNormalized: { type: String, required: true, trim: true, lowercase: true, index: true },
    purpose: { type: String, enum: EmailVerificationPurpose, required: true, index: true },
    otpHash: { type: String, required: true, select: false },
    expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
    resendAvailableAt: { type: Date, required: true },
    attempts: { type: Number, required: true, default: 0, min: 0, max: OTP_MAX_ATTEMPTS },
    maxAttempts: { type: Number, required: true, default: OTP_MAX_ATTEMPTS },
    consumedAt: { type: Date },
  },
  { timestamps: true, collection: "email_verifications" }
);

EmailVerificationSchema.index({ emailNormalized: 1, purpose: 1, createdAt: -1 });

EmailVerificationSchema.methods.matchesOtp = function (otp: string) {
  if (this.consumedAt) return false;
  if (Date.now() >= this.expiresAt.getTime()) return false;
  if (this.attempts >= this.maxAttempts) return false;
  return verifyOtp(otp, this.otpHash);
};

EmailVerificationSchema.methods.consume = function () {
  this.consumedAt = new Date();
};

const EmailVerification =
  (mongoose.models.EmailVerification ||
    mongoose.model("EmailVerification", EmailVerificationSchema)) as mongoose.Model<
    mongoose.InferSchemaType<typeof EmailVerificationSchema>
  > & {
    matchesOtp(otp: string): boolean;
    consume(): void;
  };

export { EmailVerification };
