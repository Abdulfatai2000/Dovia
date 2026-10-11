import mongoose, { Schema } from "mongoose";

import { AnalysisStatus } from "@/server/constants";

const RiskSchema = new Schema(
  {
    itemId: { type: String },
    text: { type: String, required: true, trim: true },
    severity: { type: String, enum: ["LOW", "MEDIUM", "HIGH"], required: true },
    mitigation: { type: String, trim: true },
  },
  { _id: false }
);

const OpenQuestionSchema = new Schema(
  {
    itemId: { type: String },
    text: { type: String, required: true, trim: true },
    ownerSuggestion: { type: String, trim: true },
    dueDateSuggestion: { type: Date },
  },
  { _id: false }
);

const DraftDecisionSchema = new Schema(
  {
    itemId: { type: String },
    text: { type: String, required: true, trim: true },
    context: { type: String, trim: true },
    confidence: { type: Number, min: 0, max: 1 },
  },
  { _id: false }
);

const ActionItemSchema = new Schema(
  {
    itemId: { type: String },
    assigneeId: { type: Schema.Types.ObjectId, ref: "User" },
    dueDate: { type: Date },
    status: { type: String, enum: ["NOT_STARTED", "IN_PROGRESS", "BLOCKED", "COMPLETED"] },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    suggestedAssigneeName: { type: String, trim: true },
    suggestedAssigneeEmail: { type: String, trim: true, lowercase: true },
    suggestedDueDate: { type: Date },
    priority: { type: String, enum: ["LOW", "MEDIUM", "HIGH", "URGENT"] },
    statusSuggestion: { type: String, enum: ["NOT_STARTED", "IN_PROGRESS", "BLOCKED", "COMPLETED"] },
    confidence: { type: Number, min: 0, max: 1 },
  },
  { _id: false }
);

const MeetingAnalysisSchema = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", required: true, index: true },
    meetingId: { type: Schema.Types.ObjectId, ref: "Meeting", required: true, index: true },
    contentId: { type: Schema.Types.ObjectId, ref: "MeetingContent", required: true, index: true },
    status: { type: String, enum: AnalysisStatus, required: true, default: "DRAFT", index: true },
    summary: { type: String, trim: true },
    decisions: [DraftDecisionSchema],
    actionItems: [ActionItemSchema],
    openQuestions: [OpenQuestionSchema],
    risks: [RiskSchema],
    notes: { type: String, trim: true },
    model: { type: String, trim: true },
    version: { type: String, trim: true },
    generatedAt: { type: Date },
    confirmedAt: { type: Date },
    confirmedBy: { type: Schema.Types.ObjectId, ref: "User" },
    contentHash: { type: String },
    taskIds: [{ type: Schema.Types.ObjectId, ref: "Task" }],
    decisionIds: [{ type: Schema.Types.ObjectId, ref: "Decision" }],
  },
  { timestamps: true, collection: "meeting_analyses" }
);

MeetingAnalysisSchema.index({ meetingId: 1, createdAt: -1 });
MeetingAnalysisSchema.index({ workspaceId: 1, meetingId: 1 }, { unique: true, partialFilterExpression: { status: "DRAFT" }, name: "one_active_meeting_draft" });

export type MeetingAnalysisRecord = mongoose.InferSchemaType<typeof MeetingAnalysisSchema> & { _id: mongoose.Types.ObjectId };

const MeetingAnalysis = (mongoose.models.MeetingAnalysis ||
  mongoose.model("MeetingAnalysis", MeetingAnalysisSchema)) as mongoose.Model<
  mongoose.InferSchemaType<typeof MeetingAnalysisSchema>
>;

export { MeetingAnalysis };
