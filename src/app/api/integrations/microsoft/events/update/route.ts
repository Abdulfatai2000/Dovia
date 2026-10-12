import { requireWorkspaceSession } from "@/server/workspace-session";
import { connectToDatabase } from "@/lib/db/mongoose";
import { Meeting } from "@/server/models/meeting";
import { getDecryptedTokens } from "@/services/integration.service";
import { createMicrosoftCalendarProvider } from "@/lib/integrations/microsoft.provider";

interface ExternalEventLink {
  provider: string;
  externalEventId: string;
  externalCalendarId: string;
}

interface MeetingWithLink {
  externalEventLink?: ExternalEventLink;
  title: string;
  description?: string;
  scheduledAt: Date;
  durationMinutes: number;
  timezone: string;
  externalMeetingUrl?: string;
}

export async function POST(request: Request) {
  try {
    const { workspaceId } = await requireWorkspaceSession();
    const body = await request.json();
    const { meetingId } = body;

    if (!meetingId) {
      return Response.json({ success: false, error: "Meeting ID is required" }, { status: 400 });
    }

    await connectToDatabase();

    const meeting = await Meeting.findOne({ _id: meetingId, workspaceId }).lean() as MeetingWithLink | null;
    if (!meeting) {
      return Response.json({ success: false, error: "Meeting not found" }, { status: 404 });
    }

    const existingLink = meeting.externalEventLink;
    if (!existingLink?.provider || existingLink.provider !== "MICROSOFT_CALENDAR" || !existingLink?.externalEventId) {
      return Response.json({ success: false, error: "Meeting not linked to Microsoft Calendar" }, { status: 400 });
    }

    const provider = createMicrosoftCalendarProvider();
    if (!provider) {
      return Response.json({ success: false, error: "MICROSOFT_INTEGRATION_NOT_CONFIGURED" }, { status: 500 });
    }

    const tokens = await getDecryptedTokens(workspaceId, "MICROSOFT_CALENDAR");
    if (!tokens) {
      return Response.json({ success: false, error: "MICROSOFT_INTEGRATION_NOT_CONNECTED" }, { status: 400 });
    }

    const startDate = new Date(meeting.scheduledAt);
    const endDate = new Date(startDate.getTime() + meeting.durationMinutes * 60000);

    const updatedEvent = await provider.updateEvent(
      tokens,
      existingLink.externalCalendarId,
      existingLink.externalEventId,
      {
        title: meeting.title,
        description: meeting.description,
        start: startDate,
        end: endDate,
        timezone: meeting.timezone,
        location: meeting.externalMeetingUrl,
        allDay: false,
      }
    );

    return Response.json({
      success: true,
      data: updatedEvent,
      message: "Microsoft Calendar event updated",
    });
  } catch (error) {
    console.error("Microsoft event update error:", error);
    if ((error as Error).message.includes("MICROSOFT_TOKEN_REFRESH_FAILED")) {
      return Response.json({ success: false, error: "MICROSOFT_RECONNECT_REQUIRED" }, { status: 401 });
    }
    return Response.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}