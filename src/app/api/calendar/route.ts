import { api } from "@/server/api";
import { requireWorkspaceSession } from "@/server/workspace-session";
import { calendar } from "@/server/services/read.service";
export function GET(request: Request) { return api(async () => calendar(await requireWorkspaceSession(), new URL(request.url).searchParams)); }
