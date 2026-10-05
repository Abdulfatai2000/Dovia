import mongoose, { Schema } from "mongoose";

import { MeetingPlatform, MeetingStatus, MeetingType } from "@/server/constants";

const AgendaItemSchema = new Schema(
  { id: { type: String, required: true }, title: { type: String, required: true, trim: true }, time: { type: String } },
  { _id: false }
);

const MeetingSchema = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    organizerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    participantIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
    teamId: { type: Schema.Types.ObjectId, ref: "Team", index: true },
    projectName: { type: String, trim: true },
    scheduledAt: { type: Date, required: true, index: true },
    durationMinutes: { type: Number, required: true, min: 1 },
    timezone: { type: String, default: "UTC" },
    platform: { type: String, enum: MeetingPlatform, required: true },
    meetingType: { type: String, enum: MeetingType, required: true },
    status: { type: String, enum: MeetingStatus, required: true, default: "DRAFT", index: true },
    agenda: [AgendaItemSchema],
    recurring: { type: Boolean, default: false },
    externalMeetingUrl: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    completedAt: { type: Date },
  },
  { timestamps: true, collection: "meetings" }
);

MeetingSchema.index({ workspaceId: 1, status: 1 });
MeetingSchema.index({ participantIds: 1, scheduledAt: 1 });
MeetingSchema.index({ organizerId: 1, scheduledAt: 1 });
MeetingSchema.index({ teamId: 1, scheduledAt: 1 });

const Meeting = (mongoose.models.Meeting || mongoose.model("Meeting", MeetingSchema)) as mongoose.Model<
  mongoose.InferSchemaType<typeof MeetingSchema>
>;

export { Meeting };
