import mongoose, { Schema } from "mongoose";

const WorkspaceSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    logoUrl: { type: String },
    timezone: { type: String, default: "UTC" },
    language: { type: String, default: "English" },
    dateFormat: { type: String, default: "YYYY-MM-DD" },
    weekStartsOn: { type: String, enum: ["Monday", "Sunday"], default: "Monday" },
  },
  { timestamps: true, collection: "workspaces" }
);

WorkspaceSchema.index({ slug: 1 }, { unique: true });
WorkspaceSchema.index({ ownerId: 1 });

const Workspace = (mongoose.models.Workspace || mongoose.model("Workspace", WorkspaceSchema)) as mongoose.Model<
  mongoose.InferSchemaType<typeof WorkspaceSchema>
>;

export { Workspace };
