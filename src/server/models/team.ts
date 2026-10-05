import mongoose, { Schema } from "mongoose";

const TeamSchema = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    memberIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true, collection: "teams" }
);

TeamSchema.index({ workspaceId: 1 });
TeamSchema.index({ workspaceId: 1, name: 1 });

const Team = (mongoose.models.Team || mongoose.model("Team", TeamSchema)) as mongoose.Model<
  mongoose.InferSchemaType<typeof TeamSchema>
>;

export { Team };
