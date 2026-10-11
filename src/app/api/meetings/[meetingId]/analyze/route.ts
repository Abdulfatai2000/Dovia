import { api } from "@/server/api";
import { requireWorkspaceSession } from "@/server/workspace-session";
import { analyzeMeeting, getAnalysis } from "@/server/services/analysis.service";
export const runtime = "nodejs";
export const maxDuration = 90;
type Context = { params: Promise<{ meetingId: string }> };
export function GET(_request: Request, context: Context) { return api(async () => getAnalysis(await requireWorkspaceSession(), (await context.params).meetingId)); }
export function POST(_request: Request, context: Context) { return api(async () => analyzeMeeting(await requireWorkspaceSession(), (await context.params).meetingId)); }
