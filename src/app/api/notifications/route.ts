import { api, jsonBody } from "@/server/api";
import { requireWorkspaceSession } from "@/server/workspace-session";
import { listNotifications, updateNotifications } from "@/server/services/notification.service";
export function GET(request: Request) { return api(async () => listNotifications(await requireWorkspaceSession(), new URL(request.url).searchParams)); }
export function PATCH(request: Request) { return api(async () => updateNotifications(await requireWorkspaceSession(), await jsonBody(request))); }
