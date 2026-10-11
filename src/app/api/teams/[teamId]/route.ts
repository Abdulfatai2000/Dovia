import { api, jsonBody } from "@/server/api";
import { requireWorkspaceSession } from "@/server/workspace-session";
import { getTeam, saveTeam, deleteTeam } from "@/server/services/team.service";
type Context = { params: Promise<{ teamId: string }> };
export function GET(_request: Request, context: Context) { return api(async () => getTeam(await requireWorkspaceSession(), (await context.params).teamId)); }
export function PATCH(request: Request, context: Context) { return api(async () => saveTeam(await requireWorkspaceSession(), await jsonBody(request), (await context.params).teamId)); }
export function DELETE(_request: Request, context: Context) { return api(async () => deleteTeam(await requireWorkspaceSession(), (await context.params).teamId)); }
