import { api } from "@/server/api";
import { requireWorkspaceSession } from "@/server/workspace-session";
import { search } from "@/server/services/read.service";
export function GET(request: Request) { return api(async () => search(await requireWorkspaceSession(), new URL(request.url).searchParams)); }
