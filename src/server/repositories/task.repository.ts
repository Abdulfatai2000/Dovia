import { Task } from "../models/task";
import { ApiError } from "../api";
import { TaskStatus, TaskPriority } from "../constants";
import { objectId, pagination, choice, searchPattern, date } from "../validation";
import type { WorkspaceContext } from "../workspace-session";
export async function getTask(context: WorkspaceContext, id: string) {
  const task = await Task.findOne({ _id: objectId(id), workspaceId: context.workspaceId, deletedAt: null });
  if (!task) throw new ApiError(404, "NOT_FOUND", "Task not found.");
  return task;
}
export function effectiveTaskStatus(task: { status: string; dueDate?: Date | null }, now = new Date()) {
  return task.status !== "COMPLETED" && task.dueDate && task.dueDate < now ? "OVERDUE" : task.status;
}
export async function listTasks(context: WorkspaceContext, query: URLSearchParams) {
  const { page, limit, skip } = pagination(query);
  const filter: Record<string, unknown> = { workspaceId: context.workspaceId, deletedAt: null };
  for (const key of ["meetingId", "assigneeId"]) if (query.has(key)) filter[key] = objectId(query.get(key), key);
  if (query.has("status")) {
    if (query.get("status") === "OVERDUE") { filter.status = { $ne: "COMPLETED" }; filter.dueDate = { $lt: new Date() }; }
    else filter.status = choice(query.get("status"), TaskStatus, "status");
  }
  if (query.has("priority")) filter.priority = choice(query.get("priority"), TaskPriority, "priority");
  if (query.has("search")) filter.title = { $regex: searchPattern(query.get("search")!), $options: "i" };
  if (query.has("from") || query.has("to")) filter.dueDate = { ...(typeof filter.dueDate === "object" ? filter.dueDate : {}), ...(query.has("from") ? { $gte: date(query.get("from"), "from") } : {}), ...(query.has("to") ? { $lte: date(query.get("to"), "to") } : {}) };
  const [items, total] = await Promise.all([Task.find(filter).sort({ dueDate: 1, _id: 1 }).skip(skip).limit(limit).lean(), Task.countDocuments(filter)]);
  return { items: items.map(task => ({ ...task, effectiveStatus: effectiveTaskStatus(task) })), total, page, limit };
}
