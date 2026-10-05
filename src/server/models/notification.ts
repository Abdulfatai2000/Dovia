import mongoose, { Schema } from "mongoose";

import { NotificationType } from "@/server/constants";

const NotificationSchema = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: NotificationType, required: true },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    relatedMeetingId: { type: Schema.Types.ObjectId, ref: "Meeting" },
    relatedTaskId: { type: Schema.Types.ObjectId, ref: "Task" },
    readAt: { type: Date, index: true },
  },
  { timestamps: true, collection: "notifications" }
);

NotificationSchema.index({ userId: 1, readAt: 1, createdAt: -1 });
NotificationSchema.index({ workspaceId: 1, userId: 1, createdAt: -1 });

const Notification = (mongoose.models.Notification || mongoose.model("Notification", NotificationSchema)) as mongoose.Model<
  mongoose.InferSchemaType<typeof NotificationSchema>
>;

export { Notification };
