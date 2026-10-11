import { api, jsonBody } from "@/server/api";
import { requireWorkspaceSession } from "@/server/workspace-session";
import { listMeetings } from "@/server/repositories/meeting.repository";
import { createMeeting } from "@/server/services/meeting.service";
export const runtime = "nodejs";
export function GET(request: Request) { return api(async () => listMeetings(await requireWorkspaceSession(), new URL(request.url).searchParams)); }
export function POST(request: Request) { return api(async () => createMeeting(await requireWorkspaceSession(), await jsonBody(request))); }
