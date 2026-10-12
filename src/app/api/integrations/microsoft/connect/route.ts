import { requireWorkspaceSession } from "@/server/workspace-session";
import { createMicrosoftCalendarProvider } from "@/lib/integrations/microsoft.provider";
import { generateOAuthState } from "@/lib/integrations/oauth-state";

export async function GET() {
  try {
    const { userId, workspaceId } = await requireWorkspaceSession();

    const provider = createMicrosoftCalendarProvider();
    if (!provider) {
      return Response.json({ success: false, error: "MICROSOFT_INTEGRATION_NOT_CONFIGURED" }, { status: 500 });
    }

    const state = generateOAuthState(userId, workspaceId, "microsoft");
    const authUrl = provider.getAuthUrl(state);

    return Response.json({ success: true, authUrl });
  } catch (error) {
    console.error("Microsoft connect error:", error);
    return Response.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}