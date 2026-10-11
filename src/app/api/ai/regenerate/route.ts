import { api, jsonBody } from "@/server/api";
import { requireWorkspaceSession } from "@/server/workspace-session";
import { analyzeMeeting } from "@/server/services/analysis.service";
import { objectId, only } from "@/server/validation";
export const runtime = "nodejs";
export const maxDuration = 90;
export function POST(request: Request) { return api(async () => {
 const context=await requireWorkspaceSession(), body=await jsonBody(request);
 only(body,["meetingId","analysisId"]);
 return analyzeMeeting(context,objectId(body.meetingId),objectId(body.analysisId));
}); }
