import { Notification } from "../models/notification";
import { ApiError } from "../api";
import { objectId, pagination, only, invalid } from "../validation";
import type { WorkspaceContext } from "../workspace-session";
export async function listNotifications(context: WorkspaceContext, query: URLSearchParams) {
 const { page, limit, skip } = pagination(query), filter = { workspaceId: context.workspaceId, userId: context.userId };
 const [items, total, unreadCount] = await Promise.all([Notification.find(filter).sort({ createdAt: -1, _id: -1 }).skip(skip).limit(limit).lean(), Notification.countDocuments(filter), Notification.countDocuments({ ...filter, readAt: null })]);
 return { items, total, page, limit, unreadCount };
}
export async function updateNotifications(context: WorkspaceContext, body: Record<string, unknown>) {
 only(body, ["id", "read", "all"]);
 const filter = { workspaceId: context.workspaceId, userId: context.userId };
 if (body.all === true && body.read === true && body.id === undefined) { await Notification.updateMany({ ...filter, readAt: null }, { $set: { readAt: new Date() } }); return { updated: true }; }
 if (typeof body.read !== "boolean" || body.all !== undefined) invalid("notification action");
 const result = await Notification.findOneAndUpdate({ ...filter, _id: objectId(body.id) }, { $set: { readAt: body.read ? new Date() : null } }, { new: true });
 if (!result) throw new ApiError(404, "NOT_FOUND", "Notification not found."); return result;
}
