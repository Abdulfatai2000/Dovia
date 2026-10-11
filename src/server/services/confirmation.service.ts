import "server-only";
import mongoose from "mongoose";
import { ApiError } from "../api";
import { validateReviewedOutput } from "../ai-validation";
import { analysisDto } from "../analysis-dto";
import { MeetingAnalysis } from "../models/meeting-analysis";
import { Meeting } from "../models/meeting";
import { MeetingContent } from "../models/meeting-content";
import { Membership } from "../models/membership";
import { User } from "../models/user";
import { Decision } from "../models/decision";
import { Task } from "../models/task";
import { getMeeting } from "../repositories/meeting.repository";
import { workspaceMembers } from "../repositories/workspace.repository";
import { recordActivity, notify } from "./events.service";
import { contentHash } from "./analysis.service";
import type { WorkspaceContext } from "../workspace-session";

export async function confirmAnalysis(context: WorkspaceContext, id: string, body: unknown) {
  const input = validateReviewedOutput(body);
  await getMeeting(context, id);
  const scope = { workspaceId: context.workspaceId, meetingId: id };
  const confirmed = await mongoose.connection.transaction(async session => {
    const record = await MeetingAnalysis.findOne({ ...scope, _id: input.analysisId }).session(session);
    if (!record) throw new ApiError(404, "ANALYSIS_NOT_FOUND", "Meeting analysis not found.");
    if (record.status === "CONFIRMED") return record;
    if (record.status !== "DRAFT") throw new ApiError(409, "DRAFT_CHANGED", "This draft has been replaced. Reload before confirming.");
    const content = await MeetingContent.findOne({ ...scope, _id: record.contentId }).session(session);
    if (!content || contentHash(content.rawText ?? "") !== record.contentHash) throw new ApiError(409, "CONTENT_CHANGED", "Meeting content changed. Analyze it again before confirming.");
    const assignees = [...new Set([context.userId, ...input.actionItems.map(item => item.assigneeId)])];
    const memberships = await Membership.find({ workspaceId: context.workspaceId, userId: { $in: assignees }, status: "ACTIVE" }).session(session);
    const activeUsers = await User.countDocuments({ _id: { $in: memberships.map(member => member.userId) }, status: "ACTIVE" }).session(session);
    if (activeUsers !== assignees.length) throw new ApiError(400, "INVALID_MEMBER", "Every owner must be an active member of this workspace.");
    // This write conflicts with analysis/regeneration and other confirmations.
    const meeting = await Meeting.findOneAndUpdate({ _id: id, workspaceId: context.workspaceId, deletedAt: null,
      $or: [{ aiLeaseUntil: null }, { aiLeaseUntil: { $lte: new Date() } }] },
    { $set: { status: "COMPLETED", completedAt: new Date() } }, { session, new: true });
    if (!meeting) throw new ApiError(409, "AI_PROCESSING", "The meeting is being analyzed or is unavailable. Reload and try again.");
    record.set({ status: "CONFIRMED", summary: input.summary,
      decisions: input.decisions.map(item => ({ itemId: item.id, text: item.description })),
      actionItems: input.actionItems.map(item => ({ itemId: item.id, title: item.title, description: item.description,
        assigneeId: item.assigneeId, dueDate: item.suggestedDeadline ? new Date(item.suggestedDeadline) : undefined, priority: item.priority, status: item.status })),
      openQuestions: input.openQuestions.map(item => ({ itemId: item.id, text: item.question })),
      risks: input.risks.map(item => ({ itemId: item.id, text: item.description, severity: item.severity })),
      notes: input.importantNotes.join("\n"), confirmedAt: new Date(), confirmedBy: context.userId,
    });
    await record.save({ session });
    for (const item of input.decisions) {
      const [decision] = await Decision.create([{ ...scope, analysisId: record._id, text: item.description, createdBy: context.userId, confirmedBy: context.userId }], { session });
      record.decisionIds.push(decision._id);
    }
    for (const item of input.actionItems) {
      const [task] = await Task.create([{ ...scope, title: item.title, description: item.description, assigneeId: item.assigneeId,
        dueDate: item.suggestedDeadline ? new Date(item.suggestedDeadline) : undefined, priority: item.priority, status: item.status,
        source: "MEETING", createdBy: context.userId, completedAt: item.status === "COMPLETED" ? new Date() : undefined }], { session });
      record.taskIds.push(task._id);
      await notify(context, [item.assigneeId], "TASK_ASSIGNED", item.title, { relatedMeetingId: id, relatedTaskId: String(task._id) }, session);
    }
    await record.save({ session });
    await recordActivity(context, "MEETING_ANALYSIS_CONFIRMED", "meeting", id, undefined, session);
    await notify(context, [context.userId], "MEETING_CONFIRMED", "Meeting outcome confirmed", { relatedMeetingId: id }, session);
    return record;
  });
  return { analysis: analysisDto(confirmed.toObject(), await workspaceMembers(context)),
    taskIds: confirmed.taskIds.map(String), decisionIds: confirmed.decisionIds.map(String) };
}
