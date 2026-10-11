import { requireWorkspaceSession } from "@/server/workspace-session";
import { getIntegrationStatus } from "@/services/integration.service";

export async function GET() {
  try {
    const { workspaceId } = await requireWorkspaceSession();
    const status = await getIntegrationStatus(workspaceId);
    return Response.json({ success: true, data: status });
  } catch (error) {
    console.error("Integration status error:", error);
    return Response.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}