import { api, jsonBody } from "@/server/api";
import { requireWorkspaceSession } from "@/server/workspace-session";
import { getMeeting } from "@/server/repositories/meeting.repository";
import { updateMeeting, deleteMeeting } from "@/server/services/meeting.service";
type Context = { params: Promise<{ meetingId: string }> };
export function GET(_request: Request, context: Context) { return api(async () => getMeeting(await requireWorkspaceSession(), (await context.params).meetingId)); }
export function PATCH(request: Request, context: Context) { return api(async () => updateMeeting(await requireWorkspaceSession(), (await context.params).meetingId, await jsonBody(request))); }
export function DELETE(_request: Request, context: Context) { return api(async () => deleteMeeting(await requireWorkspaceSession(), (await context.params).meetingId)); }
