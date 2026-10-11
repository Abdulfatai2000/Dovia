import { api } from "@/server/api";
import { requireWorkspaceSession } from "@/server/workspace-session";
import { followUp } from "@/server/services/read.service";
export function GET(request: Request, context: { params: Promise<{ meetingId: string }> }) { return api(async () => followUp(await requireWorkspaceSession(), (await context.params).meetingId, new URL(request.url).searchParams)); }
