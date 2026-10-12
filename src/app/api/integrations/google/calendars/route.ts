import { requireWorkspaceSession } from "@/server/workspace-session";
import { getDecryptedTokens } from "@/services/integration.service";
import { createGoogleCalendarProvider } from "@/lib/integrations/google.provider";

export async function GET() {
  try {
    const { workspaceId } = await requireWorkspaceSession();

    const provider = createGoogleCalendarProvider();
    if (!provider) {
      return Response.json({ success: false, error: "GOOGLE_INTEGRATION_NOT_CONFIGURED" }, { status: 500 });
    }

    const tokens = await getDecryptedTokens(workspaceId, "GOOGLE_CALENDAR");
    if (!tokens) {
      return Response.json({ success: false, error: "GOOGLE_INTEGRATION_NOT_CONNECTED" }, { status: 400 });
    }

    const calendars = await provider.listCalendars(tokens);

    return Response.json({ success: true, data: calendars });
  } catch (error) {
    console.error("Google calendars error:", error);
    return Response.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}