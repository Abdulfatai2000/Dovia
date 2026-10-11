import { api } from "@/server/api";
import { requireWorkspaceSession } from "@/server/workspace-session";
import { workspaceMembers } from "@/server/repositories/workspace.repository";
export function GET() { return api(async () => workspaceMembers(await requireWorkspaceSession())); }
