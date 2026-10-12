import { requireWorkspaceSession } from "@/server/workspace-session";
import { disconnectIntegration, getDecryptedTokens } from "@/services/integration.service";
import { createMicrosoftCalendarProvider } from "@/lib/integrations/microsoft.provider";

export async function POST() {
  try {
    const { workspaceId } = await requireWorkspaceSession();

    const provider = createMicrosoftCalendarProvider();
    if (!provider) {
      return Response.json({ success: false, error: "MICROSOFT_INTEGRATION_NOT_CONFIGURED" }, { status: 500 });
    }

    const tokens = await getDecryptedTokens(workspaceId, "MICROSOFT_CALENDAR");
    if (tokens?.accessToken) {
      try {
        await provider.disconnect(tokens);
      } catch {
        // Ignore revocation errors
      }
    }

    await disconnectIntegration(workspaceId, "MICROSOFT_CALENDAR");

    return Response.json({ success: true });
  } catch (error) {
    console.error("Microsoft disconnect error:", error);
    return Response.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}