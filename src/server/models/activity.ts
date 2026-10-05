import mongoose, { Schema } from "mongoose";

import { ActivityEntityType, ActivityType } from "@/server/constants";

const ActivitySchema = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", required: true, index: true },
    actorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ActivityType, required: true },
    entityType: { type: String, enum: ActivityEntityType, required: true },
    entityId: { type: Schema.Types.ObjectId, required: true },
    meetingId: { type: Schema.Types.ObjectId, ref: "Meeting", index: true },
    taskId: { type: Schema.Types.ObjectId, ref: "Task", index: true },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true, collection: "activities" }
);

ActivitySchema.index({ workspaceId: 1, createdAt: -1 });
ActivitySchema.index({ entityType: 1, entityId: 1, createdAt: -1 });
ActivitySchema.index({ meetingId: 1, createdAt: -1 });
ActivitySchema.index({ taskId: 1, createdAt: -1 });

const Activity = (mongoose.models.Activity || mongoose.model("Activity", ActivitySchema)) as mongoose.Model<
  mongoose.InferSchemaType<typeof ActivitySchema>
>;

export { Activity };
