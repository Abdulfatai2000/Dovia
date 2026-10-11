import "server-only";
import { createHash, randomUUID } from "node:crypto";
import mongoose from "mongoose";
import { analyzeWithGroq, aiConfiguration } from "@/lib/ai/groq";
import { ApiError } from "../api";
import { analysisDto } from "../analysis-dto";
import { validateProviderOutput } from "../ai-validation";
import { Meeting } from "../models/meeting";
import { MeetingAnalysis } from "../models/meeting-analysis";
import { MeetingContent } from "../models/meeting-content";
import { getMeeting } from "../repositories/meeting.repository";
import { workspaceMembers } from "../repositories/workspace.repository";
import { recordActivity, notify } from "./events.service";
import type { WorkspaceContext } from "../workspace-session";

export const contentHash = (text: string) => createHash("sha256").update(text).digest("hex");
export async function getAnalysis(context: WorkspaceContext, id: string) {
  const meeting = await getMeeting(context, id);
  const record = await MeetingAnalysis.findOne({ workspaceId: context.workspaceId, meetingId: id, status: { $in: ["DRAFT", "CONFIRMED"] } }).sort({ createdAt: -1 });
  return { analysis: record ? analysisDto(record.toObject(), await workspaceMembers(context)) : null,
    processing: Boolean(meeting.aiLeaseUntil && meeting.aiLeaseUntil > new Date()), errorCode: meeting.aiLastErrorCode ?? null };
}

export async function analyzeMeeting(context: WorkspaceContext, id: string, regenerateId?: string) {
  aiConfiguration();
  const meeting = await getMeeting(context, id);
  const content = await MeetingContent.findOne({ workspaceId: context.workspaceId, meetingId: id });
  if (!content?.rawText?.trim() || content.rawText.length > 100_000) throw new ApiError(400, "MEETING_CONTENT_REQUIRED", "Save meeting notes or transcript text before analyzing. File metadata alone cannot be analyzed.");
  const scope = { workspaceId: context.workspaceId, meetingId: id };
  const hash = contentHash(content.rawText);
  const prior = await MeetingAnalysis.findOne({ ...scope, status: { $in: ["DRAFT", "CONFIRMED"] } }).sort({ createdAt: -1 });
  if (prior?.status === "CONFIRMED") {
    if (regenerateId) throw new ApiError(409, "ANALYSIS_CONFIRMED", "This meeting outcome is already confirmed and cannot be regenerated.");
    return analysisDto(prior.toObject(), await workspaceMembers(context));
  }
  if (regenerateId && prior?._id.toString() !== regenerateId) throw new ApiError(409, "DRAFT_CHANGED", "The draft has changed. Reload before regenerating.");
  if (!regenerateId && prior?.contentHash === hash) return analysisDto(prior.toObject(), await workspaceMembers(context));
  const token = randomUUID();
  const claimed = await Meeting.findOneAndUpdate({ _id: id, workspaceId: context.workspaceId, deletedAt: null,
    $or: [{ aiLeaseUntil: null }, { aiLeaseUntil: { $lte: new Date() } }] },
  { $set: { aiLeaseToken: token, aiLeaseUntil: new Date(Date.now() + 120_000), aiLastErrorCode: null } });
  if (!claimed) throw new ApiError(409, "AI_PROCESSING", "Analysis is already in progress. Please wait and reload.");
  try {
    // Recheck after claiming the lease: another request may have just finished.
    const latest = await MeetingAnalysis.findOne({ ...scope, status: { $in: ["DRAFT", "CONFIRMED"] } }).sort({ createdAt: -1 });
    if (latest?.status === "CONFIRMED") throw new ApiError(409, "ANALYSIS_CONFIRMED", "This meeting outcome is already confirmed.");
    if (regenerateId && latest?._id.toString() !== regenerateId) throw new ApiError(409, "DRAFT_CHANGED", "The draft has changed. Reload before regenerating.");
    if (!regenerateId && latest?.contentHash === hash) return analysisDto(latest.toObject(), await workspaceMembers(context));
    const result = await analyzeWithGroq(content.rawText, meeting.scheduledAt);
    const output = validateProviderOutput(result.output);
    const record = await mongoose.connection.transaction(async session => {
      const currentContent = await MeetingContent.findOne({ ...scope, _id: content._id }).session(session);
      if (!currentContent || contentHash(currentContent.rawText ?? "") !== hash) throw new ApiError(409, "CONTENT_CHANGED", "Meeting content changed during analysis. Analyze the latest content.");
      const locked = await Meeting.updateOne({ _id: id, workspaceId: context.workspaceId, deletedAt: null, aiLeaseToken: token, aiLeaseUntil: { $gt: new Date() } }, { $set: { status: "REVIEW" } }, { session });
      if (!locked.matchedCount) throw new ApiError(409, "AI_ANALYSIS_FAILED", "Analysis expired or the meeting changed. Please retry.");
      await MeetingAnalysis.updateMany({ ...scope, status: "DRAFT" }, { $set: { status: "SUPERSEDED" } }, { session });
      const [draft] = await MeetingAnalysis.create([{ ...output, ...scope, contentId: content._id, contentHash: hash, status: "DRAFT", model: result.model, version: randomUUID(), generatedAt: new Date() }], { session });
      await recordActivity(context, regenerateId ? "MEETING_ANALYSIS_REGENERATED" : "MEETING_ANALYZED", "meeting", id, undefined, session);
      await notify(context, [context.userId], "MEETING_SUMMARY_READY", "Meeting analysis ready for review", { relatedMeetingId: id }, session);
      return draft;
    });
    return analysisDto(record.toObject(), await workspaceMembers(context));
  } catch (error) {
    const code = error instanceof ApiError ? error.code : "AI_ANALYSIS_FAILED";
    await Meeting.updateOne({ _id: id, workspaceId: context.workspaceId, aiLeaseToken: token }, { $set: { aiLastErrorCode: code } });
    if (error instanceof ApiError) throw error;
    throw new ApiError(502, "AI_ANALYSIS_FAILED", "Unable to save the meeting analysis. Please retry.");
  } finally {
    await Meeting.updateOne({ _id: id, workspaceId: context.workspaceId, aiLeaseToken: token }, { $unset: { aiLeaseToken: 1, aiLeaseUntil: 1 } });
  }
}
