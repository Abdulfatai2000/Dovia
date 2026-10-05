import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

import { UserStatus } from "@/server/constants";

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    emailNormalized: { type: String, required: true, trim: true, lowercase: true, unique: true },
    passwordHash: { type: String, required: true, select: false },
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
  return bcrypt.compare(candidate, this.passwordHash);
};

UserSchema.statics.hashPassword = (password: string) => bcrypt.hash(password, 12);

const User = (mongoose.models.User || mongoose.model("User", UserSchema)) as mongoose.Model<
  mongoose.InferSchemaType<typeof UserSchema>
> & {
  comparePassword(candidate: string): Promise<boolean>;
  hashPassword(password: string): Promise<string>;
};

export { User };
