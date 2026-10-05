import mongoose, { Schema } from "mongoose";

import { MembershipRole, MembershipStatus } from "@/server/constants";

const MembershipSchema = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, enum: MembershipRole, required: true, default: "MEMBER", index: true },
    status: { type: String, enum: MembershipStatus, default: "ACTIVE", index: true },
    joinedAt: { type: Date, default: () => new Date() },
  },
  { timestamps: true, collection: "memberships" }
);

MembershipSchema.index({ workspaceId: 1, userId: 1 }, { unique: true });
MembershipSchema.index({ userId: 1 });
MembershipSchema.index({ workspaceId: 1, role: 1 });

const Membership = (mongoose.models.Membership || mongoose.model("Membership", MembershipSchema)) as mongoose.Model<
  mongoose.InferSchemaType<typeof MembershipSchema>
>;

export { Membership };
