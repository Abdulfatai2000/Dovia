import { api } from "@/server/api";
import { requireWorkspaceSession } from "@/server/workspace-session";
import { report } from "@/server/services/report.service";
export function GET(request:Request){return api(async()=>report(await requireWorkspaceSession(),new URL(request.url).searchParams));}
