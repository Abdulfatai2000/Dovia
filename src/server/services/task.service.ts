import { Task } from "../models/task";
import { Decision } from "../models/decision";
import { ApiError } from "../api";
import { getTask } from "../repositories/task.repository";
import { getMeeting } from "../repositories/meeting.repository";
import { validateMembers } from "../repositories/workspace.repository";
import { taskInput } from "../task-validation";
import { recordActivity, notify } from "./events.service";
import { requireManager, type WorkspaceContext } from "../workspace-session";
import type { ActivityType } from "../constants";
export async function createTask(context: WorkspaceContext, body: Record<string, unknown>) {
  const input = taskInput(body);
  if (input.assigneeId) await validateMembers(context, [String(input.assigneeId)]);
  if (input.meetingId) await getMeeting(context, String(input.meetingId));
  if (input.decisionId && !await Decision.exists({ _id: input.decisionId, workspaceId: context.workspaceId, ...(input.meetingId ? { meetingId: input.meetingId } : {}) })) throw new ApiError(404, "NOT_FOUND", "Decision not found.");
  const task = await Task.create({ ...input, source: "MANUAL", workspaceId: context.workspaceId, createdBy: context.userId, completedAt: input.status === "COMPLETED" ? new Date() : undefined });
  await recordActivity(context, "TASK_CREATED", "task", String(task._id), task.meetingId?.toString());
  if (task.assigneeId) await notify(context, [String(task.assigneeId)], "TASK_ASSIGNED", task.title, { relatedTaskId: String(task._id), relatedMeetingId: task.meetingId?.toString() });
  return task;
}
export async function updateTask(context: WorkspaceContext, id: string, body: Record<string, unknown>) {
  const input = taskInput(body, true);
  const task = await getTask(context, id);
  if (![String(task.createdBy), String(task.assigneeId)].includes(context.userId)) requireManager(context);
  if (input.assigneeId) await validateMembers(context, [String(input.assigneeId)]);
  const changed = Object.keys(input).filter(key => String(task.get(key) ?? "") !== String(input[key] ?? ""));
  if (input.status !== undefined) input.completedAt = input.status === "COMPLETED" ? task.completedAt ?? new Date() : null;
  task.set(input); await task.save();
  const events: Record<string, ActivityType> = { status: task.status === "COMPLETED" ? "TASK_COMPLETED" : task.status === "BLOCKED" ? "TASK_BLOCKED" : "TASK_STATUS_CHANGED", assigneeId: "TASK_ASSIGNEE_CHANGED", dueDate: "TASK_DUE_DATE_CHANGED", priority: "TASK_PRIORITY_CHANGED" };
  for (const key of changed) if (events[key]) await recordActivity(context, events[key], "task", id, task.meetingId?.toString());
  if (changed.includes("assigneeId") && task.assigneeId) await notify(context, [String(task.assigneeId)], "TASK_ASSIGNED", task.title, { relatedTaskId: id });
  if (changed.includes("status") && task.status === "COMPLETED") await notify(context, [String(task.createdBy)], "TASK_COMPLETED", task.title, { relatedTaskId: id });
  return task;
}
export async function deleteTask(context: WorkspaceContext, id: string) {
  requireManager(context); const task = await getTask(context, id); task.deletedAt = new Date(); await task.save(); return { deleted: true };
}
