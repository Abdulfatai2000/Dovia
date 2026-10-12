import { requireWorkspaceSession } from "@/server/workspace-session";
import { connectToDatabase } from "@/lib/db/mongoose";
import { Meeting } from "@/server/models/meeting";
import { getDecryptedTokens } from "@/services/integration.service";
import { createGoogleCalendarProvider } from "@/lib/integrations/google.provider";
import { updateIntegrationTokens } from "@/services/integration.service";
import { ExternalCalendarEvent } from "@/lib/integrations/provider-contract";

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
    const { meetingId, calendarId = "primary" } = body;

    if (!meetingId) {
      return Response.json({ success: false, error: "Meeting ID is required" }, { status: 400 });
    }

    await connectToDatabase();

    const meeting = await Meeting.findOne({ _id: meetingId, workspaceId }).lean() as MeetingWithLink | null;
    if (!meeting) {
      return Response.json({ success: false, error: "Meeting not found" }, { status: 404 });
    }

    const provider = createGoogleCalendarProvider();
    if (!provider) {
      return Response.json({ success: false, error: "GOOGLE_INTEGRATION_NOT_CONFIGURED" }, { status: 500 });
    }

    const tokens = await getDecryptedTokens(workspaceId, "GOOGLE_CALENDAR");
    if (!tokens) {
      return Response.json({ success: false, error: "GOOGLE_INTEGRATION_NOT_CONNECTED" }, { status: 400 });
    }

    // Check if meeting already has a linked Google event
    const existingLink = meeting.externalEventLink;
    if (existingLink?.provider === "GOOGLE_CALENDAR" && existingLink?.externalEventId) {
      // Update existing event instead of creating new one
      try {
        const updatedEvent = await provider.updateEvent(
          tokens,
          existingLink.externalCalendarId,
          existingLink.externalEventId,
          {
            title: meeting.title,
            description: meeting.description,
            start: new Date(meeting.scheduledAt),
            end: new Date(new Date(meeting.scheduledAt).getTime() + meeting.durationMinutes * 60000),
            timezone: meeting.timezone,
            location: meeting.externalMeetingUrl,
            allDay: false,
          }
        );

        return Response.json({
          success: true,
          data: updatedEvent,
          message: "Google Calendar event updated",
        });
      } catch (error) {
        if ((error as Error).message.includes("GOOGLE_TOKEN_REFRESH_FAILED")) {
          await updateIntegrationTokens(workspaceId, "GOOGLE_CALENDAR", {
            accessToken: "",
            expiresAt: new Date(0),
          });
          return Response.json({ success: false, error: "GOOGLE_RECONNECT_REQUIRED" }, { status: 401 });
        }
        throw error;
      }
    }

    // Create new event
    const startDate = new Date(meeting.scheduledAt);
    const endDate = new Date(startDate.getTime() + meeting.durationMinutes * 60000);

    const event: Partial<ExternalCalendarEvent> = {
      title: meeting.title,
      description: meeting.description,
      start: startDate,
      end: endDate,
      timezone: meeting.timezone,
      location: meeting.externalMeetingUrl,
      allDay: false,
    };

    const createdEvent = await provider.createEvent(tokens, calendarId, event);

    // Update meeting with external event link
    await Meeting.findByIdAndUpdate(meetingId, {
      externalEventLink: {
        provider: "GOOGLE_CALENDAR",
        externalEventId: createdEvent.externalEventId,
        externalCalendarId: createdEvent.calendarId,
      },
    });

    return Response.json({
      success: true,
      data: createdEvent,
      message: "Google Calendar event created",
    });
  } catch (error) {
    console.error("Google event create error:", error);
    if ((error as Error).message.includes("GOOGLE_TOKEN_REFRESH_FAILED")) {
      return Response.json({ success: false, error: "GOOGLE_RECONNECT_REQUIRED" }, { status: 401 });
    }
    return Response.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}