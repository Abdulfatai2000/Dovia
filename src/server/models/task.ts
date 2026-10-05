import mongoose, { Schema } from "mongoose";

import { TaskPriority, TaskSource, TaskStatus } from "@/server/constants";

const TaskSchema = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", required: true, index: true },
    meetingId: { type: Schema.Types.ObjectId, ref: "Meeting", index: true },
    decisionId: { type: Schema.Types.ObjectId, ref: "Decision" },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    assigneeId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    dueDate: { type: Date, index: true },
    priority: { type: String, enum: TaskPriority, required: true, default: "MEDIUM" },
    status: { type: String, enum: TaskStatus, required: true, default: "NOT_STARTED", index: true },
    blockedReason: { type: String, trim: true },
    completedAt: { type: Date },
    source: { type: String, enum: TaskSource, required: true, default: "MANUAL" },
  },
  { timestamps: true, collection: "tasks" }
);

TaskSchema.index({ workspaceId: 1, assigneeId: 1, status: 1 });
TaskSchema.index({ workspaceId: 1, dueDate: 1 });
TaskSchema.index({ assigneeId: 1, dueDate: 1 });

const Task = (mongoose.models.Task || mongoose.model("Task", TaskSchema)) as mongoose.Model<
  mongoose.InferSchemaType<typeof TaskSchema>
>;

export { Task };
