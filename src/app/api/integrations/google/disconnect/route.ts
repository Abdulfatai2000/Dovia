import { requireWorkspaceSession } from "@/server/workspace-session";
import { disconnectIntegration, getDecryptedTokens } from "@/services/integration.service";
import { createGoogleCalendarProvider } from "@/lib/integrations/google.provider";

export async function POST() {
  try {
    const { workspaceId } = await requireWorkspaceSession();

    const provider = createGoogleCalendarProvider();
    if (!provider) {
      return Response.json({ success: false, error: "GOOGLE_INTEGRATION_NOT_CONFIGURED" }, { status: 500 });
    }

    const tokens = await getDecryptedTokens(workspaceId, "GOOGLE_CALENDAR");
    if (tokens?.accessToken) {
      try {
        await provider.disconnect(tokens);
      } catch {
        // Ignore revocation errors
      }
    }

    await disconnectIntegration(workspaceId, "GOOGLE_CALENDAR");

    return Response.json({ success: true });
  } catch (error) {
    console.error("Google disconnect error:", error);
    return Response.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}