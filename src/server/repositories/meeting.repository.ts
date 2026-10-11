import { Meeting } from "../models/meeting";
import { ApiError } from "../api";
import { MeetingStatus } from "../constants";
import { choice, date, objectId, pagination, searchPattern } from "../validation";
import type { WorkspaceContext } from "../workspace-session";
export async function getMeeting(context: WorkspaceContext, id: string) {
  const meeting = await Meeting.findOne({ _id: objectId(id), workspaceId: context.workspaceId, deletedAt: null });
  if (!meeting) throw new ApiError(404, "NOT_FOUND", "Meeting not found.");
  return meeting;
}
export async function listMeetings(context: WorkspaceContext, query: URLSearchParams) {
  const { page, limit, skip } = pagination(query);
  const filter: Record<string, unknown> = { workspaceId: context.workspaceId, deletedAt: null };
  if (query.has("status")) filter.status = choice(query.get("status"), MeetingStatus, "status");
  if (query.has("search")) filter.title = { $regex: searchPattern(query.get("search")!), $options: "i" };
  if (query.has("teamId")) filter.teamId = objectId(query.get("teamId"));
  if (query.has("from") || query.has("to")) filter.scheduledAt = { ...(query.has("from") ? { $gte: date(query.get("from"), "from") } : {}), ...(query.has("to") ? { $lte: date(query.get("to"), "to") } : {}) };
  const [items, total] = await Promise.all([Meeting.find(filter).sort({ scheduledAt: -1, _id: -1 }).skip(skip).limit(limit).lean(), Meeting.countDocuments(filter)]);
  return { items, total, page, limit };
}
