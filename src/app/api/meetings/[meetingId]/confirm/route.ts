import { api, jsonBody } from "@/server/api";
import { requireWorkspaceSession } from "@/server/workspace-session";
import { confirmAnalysis } from "@/server/services/confirmation.service";
export const runtime = "nodejs";
export function POST(request: Request, context: { params: Promise<{ meetingId: string }> }) {
 return api(async () => confirmAnalysis(await requireWorkspaceSession(), (await context.params).meetingId, await jsonBody(request)));
}
