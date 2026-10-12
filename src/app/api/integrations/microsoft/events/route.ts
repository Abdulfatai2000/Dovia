import { requireWorkspaceSession } from "@/server/workspace-session";
import { getDecryptedTokens } from "@/services/integration.service";
import { createMicrosoftCalendarProvider } from "@/lib/integrations/microsoft.provider";

export async function GET(request: Request) {
  try {
    const { workspaceId } = await requireWorkspaceSession();
    const { searchParams } = new URL(request.url);

    const calendarId = searchParams.get("calendarId");
    const timeMin = searchParams.get("timeMin") ? new Date(searchParams.get("timeMin")!) : new Date();
    const timeMax = searchParams.get("timeMax") ? new Date(searchParams.get("timeMax")!) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    if (!calendarId) {
      return Response.json({ success: false, error: "Calendar ID is required" }, { status: 400 });
    }

    const provider = createMicrosoftCalendarProvider();
    if (!provider) {
      return Response.json({ success: false, error: "MICROSOFT_INTEGRATION_NOT_CONFIGURED" }, { status: 500 });
    }

    const tokens = await getDecryptedTokens(workspaceId, "MICROSOFT_CALENDAR");
    if (!tokens) {
      return Response.json({ success: false, error: "MICROSOFT_INTEGRATION_NOT_CONNECTED" }, { status: 400 });
    }

    const events = await provider.listEvents(tokens, calendarId, timeMin, timeMax);

    return Response.json({ success: true, data: events });
  } catch (error) {
    console.error("Microsoft events error:", error);
    return Response.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}