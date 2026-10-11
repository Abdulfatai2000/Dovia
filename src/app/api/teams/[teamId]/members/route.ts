import { api, jsonBody } from "@/server/api";
import { requireWorkspaceSession } from "@/server/workspace-session";
import { teamMembers, addMembers } from "@/server/services/team.service";
type Context = { params: Promise<{ teamId: string }> };
export function GET(_request: Request, context: Context) { return api(async () => teamMembers(await requireWorkspaceSession(), (await context.params).teamId)); }
export function POST(request: Request, context: Context) { return api(async () => addMembers(await requireWorkspaceSession(), (await context.params).teamId, await jsonBody(request))); }
