import mongoose, { Schema } from "mongoose";

const DecisionSchema = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", required: true, index: true },
    meetingId: { type: Schema.Types.ObjectId, ref: "Meeting", required: true, index: true },
    analysisId: { type: Schema.Types.ObjectId, ref: "MeetingAnalysis" },
    text: { type: String, required: true, trim: true },
    context: { type: String, trim: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    confirmedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true, collection: "decisions" }
);

DecisionSchema.index({ workspaceId: 1, meetingId: 1 });
DecisionSchema.index({ meetingId: 1 });

const Decision = (mongoose.models.Decision || mongoose.model("Decision", DecisionSchema)) as mongoose.Model<
  mongoose.InferSchemaType<typeof DecisionSchema>
>;

export { Decision };
