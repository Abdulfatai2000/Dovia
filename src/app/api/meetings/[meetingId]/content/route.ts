import { api, jsonBody } from "@/server/api";
import { requireWorkspaceSession } from "@/server/workspace-session";
import { getContent, saveContent } from "@/server/services/meeting.service";
type Context = { params: Promise<{ meetingId: string }> };
export function GET(_request: Request, context: Context) { return api(async () => getContent(await requireWorkspaceSession(), (await context.params).meetingId)); }
export function POST(request: Request, context: Context) { return api(async () => saveContent(await requireWorkspaceSession(), (await context.params).meetingId, await jsonBody(request))); }
