import mongoose, { Schema } from "mongoose";

import { MeetingContentType } from "@/server/constants";
import { FileMetadata } from "@/server/types";

const FileMetadataSchema = new Schema<FileMetadata>(
  {
    name: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true, min: 0 },
    storageProvider: { type: String },
    storageKey: { type: String },
    url: { type: String },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: () => new Date() },
  },
  { _id: false }
);

const MeetingContentSchema = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", required: true, index: true },
    meetingId: { type: Schema.Types.ObjectId, ref: "Meeting", required: true, index: true },
    contentType: { type: String, enum: MeetingContentType, required: true },
    rawText: { type: String },
    source: { type: String, trim: true },
    files: [FileMetadataSchema],
    characterCount: { type: Number, min: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true, collection: "meeting_contents" }
);

MeetingContentSchema.index({ meetingId: 1 });
MeetingContentSchema.index({ workspaceId: 1, meetingId: 1 });

const MeetingContent = (mongoose.models.MeetingContent ||
  mongoose.model("MeetingContent", MeetingContentSchema)) as mongoose.Model<
  mongoose.InferSchemaType<typeof MeetingContentSchema>
>;

export { MeetingContent };
