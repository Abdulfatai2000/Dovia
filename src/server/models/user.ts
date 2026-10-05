import mongoose, { Schema } from "mongoose";
import crypto from "crypto";

import { UserStatus } from "@/server/constants";

const SALT_LENGTH = 16;
const KEY_LENGTH = 64;
const SCRYPT_PARAMS = { N: 16384, r: 8, p: 1 } as const;

function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(SALT_LENGTH).toString("hex");
  const derived = crypto.scryptSync(password, salt, KEY_LENGTH, SCRYPT_PARAMS);
  return { hash: derived.toString("hex"), salt };
}

function verifyPassword(password: string, hash: string, salt: string): boolean {
  try {
    const derived = crypto.scryptSync(password, salt, KEY_LENGTH, SCRYPT_PARAMS);
    return crypto.timingSafeEqual(Buffer.from(hash, "hex"), derived);
  } catch {
    return false;
  }
}

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    emailNormalized: { type: String, required: true, trim: true, lowercase: true, unique: true },
    passwordHash: { type: String, required: true, select: false },
    passwordSalt: { type: String, required: true, select: false },
    emailVerifiedAt: { type: Date },
    avatarUrl: { type: String },
    jobTitle: { type: String, trim: true },
    timezone: { type: String, default: "UTC" },
    status: { type: String, enum: UserStatus, default: "ACTIVE", index: true },
  },
  { timestamps: true, collection: "users" }
);

UserSchema.index({ emailNormalized: 1 }, { unique: true });

UserSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

function sanitizeUserDocument(doc: Record<string, unknown>) {
  delete doc.passwordHash;
  delete doc.passwordSalt;
  return doc;
}

UserSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform(_doc, ret) {
    return ret && typeof ret === "object" ? sanitizeUserDocument(ret as Record<string, unknown>) : ret;
  },
});

UserSchema.set("toObject", { virtuals: true, versionKey: false });

UserSchema.methods.comparePassword = function (candidate: string) {
  return verifyPassword(candidate, this.passwordHash, this.passwordSalt);
};

UserSchema.statics.hashPassword = hashPassword;

const User = (mongoose.models.User || mongoose.model("User", UserSchema)) as mongoose.Model<
  mongoose.InferSchemaType<typeof UserSchema>
> & {
  comparePassword(candidate: string): boolean;
  hashPassword(password: string): { hash: string; salt: string };
};

export { User };
