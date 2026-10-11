import { Activity } from "../models/activity";
import type { ClientSession } from "mongoose";
import { Notification } from "../models/notification";
import type { ActivityType, NotificationType } from "../constants";
import type { WorkspaceContext } from "../workspace-session";
export async function recordActivity(context: WorkspaceContext, type: ActivityType, entityType: "meeting" | "task", entityId: string, meetingId?: string, session?: ClientSession) {
  await Activity.create([{ workspaceId: context.workspaceId, actorId: context.userId, type, entityType, entityId, meetingId: entityType === "meeting" ? entityId : meetingId, taskId: entityType === "task" ? entityId : undefined }], { session });
}
export async function notify(context: WorkspaceContext, userIds: string[], type: NotificationType, title: string, related: { relatedMeetingId?: string; relatedTaskId?: string }, session?: ClientSession) {
  if (!userIds.length) return;
  await Notification.insertMany([...new Set(userIds)].map(userId => ({ workspaceId: context.workspaceId, userId, type, title, message: title, ...related })), { session });
}
