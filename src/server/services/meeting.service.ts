import { Meeting } from "../models/meeting";
import { MeetingContent } from "../models/meeting-content";
import { getMeeting } from "../repositories/meeting.repository";
import { validateMembers, validateTeam } from "../repositories/workspace.repository";
import { meetingInput, contentInput } from "../meeting-validation";
import { recordActivity, notify } from "./events.service";
import { requireManager, type WorkspaceContext } from "../workspace-session";
export async function createMeeting(context: WorkspaceContext, body: Record<string, unknown>) {
  const input = meetingInput(body);
  const participants = [...new Set([context.userId, ...((input.participantIds as string[] | undefined) ?? [])])];
  await validateMembers(context, participants);
  if (input.teamId) await validateTeam(context, String(input.teamId));
  const meeting = await Meeting.create({ ...input, status: input.status ?? "SCHEDULED", completedAt: input.status === "COMPLETED" ? new Date() : undefined, participantIds: participants, workspaceId: context.workspaceId, organizerId: context.userId, createdBy: context.userId });
  await recordActivity(context, "MEETING_CREATED", "meeting", String(meeting._id));
  await notify(context, participants, "MEETING_CREATED", meeting.title, { relatedMeetingId: String(meeting._id) });
  return meeting;
}
export async function updateMeeting(context: WorkspaceContext, id: string, body: Record<string, unknown>) {
  const input = meetingInput(body, true);
  const meeting = await getMeeting(context, id);
  if (String(meeting.organizerId) !== context.userId) requireManager(context);
  if (input.participantIds) await validateMembers(context, input.participantIds as string[]);
  if (input.teamId) await validateTeam(context, String(input.teamId));
  if (input.status !== undefined) input.completedAt = input.status === "COMPLETED" ? meeting.completedAt ?? new Date() : null;
  meeting.set(input); await meeting.save();
  await recordActivity(context, input.status === "COMPLETED" ? "MEETING_COMPLETED" : "MEETING_UPDATED", "meeting", id);
  return meeting;
}
export async function deleteMeeting(context: WorkspaceContext, id: string) {
  requireManager(context);
  const meeting = await getMeeting(context, id);
  meeting.deletedAt = new Date(); meeting.status = "CANCELLED"; await meeting.save();
  await recordActivity(context, "MEETING_CANCELLED", "meeting", id);
  return { deleted: true };
}
export async function getContent(context: WorkspaceContext, id: string) {
  await getMeeting(context, id);
  return MeetingContent.findOne({ workspaceId: context.workspaceId, meetingId: id }).sort({ updatedAt: -1 }).lean();
}
export async function saveContent(context: WorkspaceContext, id: string, body: Record<string, unknown>) {
  await getMeeting(context, id);
  const input = contentInput(body);
  const content = await MeetingContent.findOneAndUpdate({ workspaceId: context.workspaceId, meetingId: id }, { $set: { ...input, createdBy: context.userId } }, { upsert: true, new: true, runValidators: true });
  await recordActivity(context, "MEETING_CONTENT_ADDED", "meeting", id);
  return content;
}
