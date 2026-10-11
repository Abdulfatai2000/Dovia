import mongoose, { Schema } from "mongoose";

export const IntegrationProvider = ["GOOGLE_CALENDAR", "MICROSOFT_CALENDAR", "SLACK"] as const;
export type IntegrationProvider = (typeof IntegrationProvider)[number];

export const IntegrationStatus = ["CONNECTED", "DISCONNECTED", "RECONNECT_REQUIRED", "ERROR"] as const;
export type IntegrationStatus = (typeof IntegrationStatus)[number];

const IntegrationSchema = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    provider: { type: String, enum: IntegrationProvider, required: true, index: true },
    providerAccountId: { type: String, required: true, trim: true },
    encryptedAccessToken: { type: String, select: false },
    encryptedRefreshToken: { type: String, select: false },
    tokenExpiresAt: { type: Date },
    scopes: [{ type: String, trim: true }],
    status: { type: String, enum: IntegrationStatus, required: true, default: "DISCONNECTED", index: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true, collection: "integrations" }
);

IntegrationSchema.index({ workspaceId: 1, provider: 1 }, { unique: true });
IntegrationSchema.index({ userId: 1, provider: 1 });
IntegrationSchema.index({ workspaceId: 1, status: 1 });

const Integration = (mongoose.models.Integration ||
  mongoose.model("Integration", IntegrationSchema)) as mongoose.Model<
  mongoose.InferSchemaType<typeof IntegrationSchema>
>;

export { Integration };