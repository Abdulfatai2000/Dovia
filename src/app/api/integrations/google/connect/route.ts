import { requireWorkspaceSession } from "@/server/workspace-session";
import { createGoogleCalendarProvider } from "@/lib/integrations/google.provider";
import { generateOAuthState } from "@/lib/integrations/oauth-state";

export async function GET() {
  try {
    const { userId, workspaceId } = await requireWorkspaceSession();

    const provider = createGoogleCalendarProvider();
    if (!provider) {
      return Response.json({ success: false, error: "GOOGLE_INTEGRATION_NOT_CONFIGURED" }, { status: 500 });
    }

    const state = generateOAuthState(userId, workspaceId, "google");
    const authUrl = provider.getAuthUrl(state);

    return Response.json({ success: true, authUrl });
  } catch (error) {
    console.error("Google connect error:", error);
    return Response.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}