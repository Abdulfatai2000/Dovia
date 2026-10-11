import { api } from "@/server/api";
import { requireWorkspaceSession } from "@/server/workspace-session";
import { activity } from "@/server/services/read.service";
export function GET(request: Request) { return api(async () => activity(await requireWorkspaceSession(), new URL(request.url).searchParams)); }
