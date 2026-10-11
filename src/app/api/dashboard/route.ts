import { api } from "@/server/api";
import { requireWorkspaceSession } from "@/server/workspace-session";
import { dashboard } from "@/server/services/read.service";
export function GET() { return api(async () => dashboard(await requireWorkspaceSession())); }
