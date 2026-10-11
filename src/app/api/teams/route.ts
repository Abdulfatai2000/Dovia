import { api, jsonBody } from "@/server/api";
import { requireWorkspaceSession } from "@/server/workspace-session";
import { listTeams, saveTeam } from "@/server/services/team.service";
export function GET() { return api(async () => listTeams(await requireWorkspaceSession())); }
export function POST(request: Request) { return api(async () => saveTeam(await requireWorkspaceSession(), await jsonBody(request))); }
