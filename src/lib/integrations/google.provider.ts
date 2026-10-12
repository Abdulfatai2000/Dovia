import { IntegrationProvider } from "@/server/models/integration";
import { BaseProvider, CalendarProvider, IntegrationConfig, TokenSet, ConnectionStatus, ExternalCalendarEvent } from "./provider-contract";
import { serverEnv } from "@/lib/env.server";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_CALENDAR_SCOPES = [
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/calendar.calendarlist.readonly",
];

export class GoogleCalendarProvider implements CalendarProvider {
  readonly provider = IntegrationProvider[0];
  readonly config: IntegrationConfig;

  constructor() {
    if (!serverEnv.GOOGLE_CLIENT_ID || !serverEnv.GOOGLE_CLIENT_SECRET) {
      throw new Error("GOOGLE_INTEGRATION_NOT_CONFIGURED");
    }
    this.config = {
      clientId: serverEnv.GOOGLE_CLIENT_ID,
      clientSecret: serverEnv.GOOGLE_CLIENT_SECRET,
      redirectUri: `${serverEnv.APP_URL}/api/integrations/google/callback`,
      scopes: GOOGLE_CALENDAR_SCOPES,
    };
  }

  getAuthUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: "code",
      scope: this.config.scopes.join(" "),
      state,
      access_type: "offline",
      prompt: "consent",
    });
    return `${GOOGLE_AUTH_URL}?${params.toString()}`;
  }

  async exchangeCodeForTokens(code: string): Promise<TokenSet> {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: this.config.redirectUri,
    });

    const response = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`GOOGLE_OAUTH_FAILED: ${data.error_description || data.error || "Token exchange failed"}`);
    }

    const expiresAt = new Date(Date.now() + (data.expires_in || 3600) * 1000);

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt,
      scopes: data.scope ? data.scope.split(" ") : this.config.scopes,
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<TokenSet> {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    });

    const response = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`GOOGLE_TOKEN_REFRESH_FAILED: ${data.error_description || data.error || "Token refresh failed"}`);
    }

    const expiresAt = new Date(Date.now() + (data.expires_in || 3600) * 1000);

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt,
      scopes: data.scope ? data.scope.split(" ") : this.config.scopes,
    };
  }

  async getConnectionStatus(tokens: TokenSet): Promise<ConnectionStatus> {
    try {
      const response = await fetch("https://www.googleapis.com/oauth2/v3/tokeninfo", {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
      });

      if (!response.ok) {
        return { connected: false, status: "ERROR", error: "Invalid access token" };
      }

      const data = await response.json();
      return {
        connected: true,
        status: "CONNECTED",
        providerAccountId: data.email || data.user_id,
        expiresAt: tokens.expiresAt,
      };
    } catch {
      return { connected: false, status: "ERROR", error: "Failed to verify connection" };
    }
  }

  async disconnect(tokens: TokenSet): Promise<void> {
    try {
      await fetch(`https://oauth2.googleapis.com/revoke?token=${tokens.accessToken}`, {
        method: "POST",
      });
    } catch {
      // Ignore revocation errors - we'll still remove local tokens
    }
  }

  async listCalendars(tokens: TokenSet): Promise<{ id: string; summary: string; primary: boolean; accessRole: string }[]> {
    const response = await fetch("https://www.googleapis.com/calendar/v3/users/me/calendarList?minAccessRole=reader", {
      headers: { Authorization: `Bearer ${tokens.accessToken}` },
    });

    if (!response.ok) {
      throw new Error("GOOGLE_CALENDAR_FETCH_FAILED");
    }

    const data = await response.json();
    return (data.items || []).map((cal: { id: string; summary: string; primary?: boolean; accessRole: string }) => ({
      id: cal.id,
      summary: cal.summary,
      primary: cal.primary || false,
      accessRole: cal.accessRole,
    }));
  }

  async listEvents(tokens: TokenSet, calendarId: string, timeMin: Date, timeMax: Date): Promise<ExternalCalendarEvent[]> {
    const params = new URLSearchParams({
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      singleEvents: "true",
      orderBy: "startTime",
      showDeleted: "false",
    });

    const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?${params}`, {
      headers: { Authorization: `Bearer ${tokens.accessToken}` },
    });

    if (!response.ok) {
      throw new Error("GOOGLE_CALENDAR_FETCH_FAILED");
    }

    const data = await response.json();
    return (data.items || []).map((event: { id: string; summary?: string; description?: string; start: { dateTime?: string; date?: string; timeZone?: string }; end: { dateTime?: string; date?: string; timeZone?: string }; location?: string; htmlLink?: string; transparency?: string }) => {
      const start = event.start.dateTime ? new Date(event.start.dateTime) : new Date(event.start.date!);
      const end = event.end.dateTime ? new Date(event.end.dateTime) : new Date(event.end.date!);
      const allDay = !event.start.dateTime;

      return {
        id: event.id,
        provider: "GOOGLE_CALENDAR" as IntegrationProvider,
        externalEventId: event.id,
        calendarId,
        title: event.summary || "(No title)",
        description: event.description,
        start,
        end,
        timezone: event.start.timeZone || "UTC",
        location: event.location,
        meetingUrl: event.htmlLink,
        allDay,
        readOnly: event.transparency === "transparent",
      };
    });
  }

  async createEvent(tokens: TokenSet, calendarId: string, event: Partial<ExternalCalendarEvent>): Promise<ExternalCalendarEvent> {
    const googleEvent = this.toGoogleEvent(event);

    const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(googleEvent),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`GOOGLE_EVENT_CREATE_FAILED: ${error.error?.message || "Failed to create event"}`);
    }

    const created = await response.json();
    return this.fromGoogleEvent(created, calendarId);
  }

  async updateEvent(tokens: TokenSet, calendarId: string, eventId: string, event: Partial<ExternalCalendarEvent>): Promise<ExternalCalendarEvent> {
    const googleEvent = this.toGoogleEvent(event);

    const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(googleEvent),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`GOOGLE_EVENT_UPDATE_FAILED: ${error.error?.message || "Failed to update event"}`);
    }

    const updated = await response.json();
    return this.fromGoogleEvent(updated, calendarId);
  }

  async deleteEvent(tokens: TokenSet, calendarId: string, eventId: string): Promise<void> {
    const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${tokens.accessToken}` },
    });

    if (!response.ok && response.status !== 404) {
      throw new Error("GOOGLE_EVENT_DELETE_FAILED");
    }
  }

  private toGoogleEvent(event: Partial<ExternalCalendarEvent>): Record<string, unknown> {
    const googleEvent: Record<string, unknown> = {};

    if (event.title) googleEvent.summary = event.title;
    if (event.description) googleEvent.description = event.description;
    if (event.location) googleEvent.location = event.location;

    if (event.start) {
      if (event.allDay) {
        googleEvent.start = { date: event.start.toISOString().split("T")[0] };
      } else {
        googleEvent.start = { dateTime: event.start.toISOString(), timeZone: event.timezone || "UTC" };
      }
    }

    if (event.end) {
      if (event.allDay) {
        googleEvent.end = { date: event.end.toISOString().split("T")[0] };
      } else {
        googleEvent.end = { dateTime: event.end.toISOString(), timeZone: event.timezone || "UTC" };
      }
    }

    return googleEvent;
  }

  private fromGoogleEvent(event: { id: string; summary?: string; description?: string; start: { dateTime?: string; date?: string; timeZone?: string }; end: { dateTime?: string; date?: string; timeZone?: string }; location?: string; htmlLink?: string; transparency?: string }, calendarId: string): ExternalCalendarEvent {
    const start = event.start.dateTime ? new Date(event.start.dateTime) : new Date(event.start.date!);
    const end = event.end.dateTime ? new Date(event.end.dateTime) : new Date(event.end.date!);
    const allDay = !event.start.dateTime;

    return {
      id: event.id,
      provider: "GOOGLE_CALENDAR" as IntegrationProvider,
      externalEventId: event.id,
      calendarId,
      title: event.summary || "(No title)",
      description: event.description,
      start,
      end,
      timezone: event.start.timeZone || "UTC",
      location: event.location,
      meetingUrl: event.htmlLink,
      allDay,
      readOnly: event.transparency === "transparent",
    };
  }
}

export function createGoogleCalendarProvider(): GoogleCalendarProvider | null {
  if (!serverEnv.GOOGLE_CLIENT_ID || !serverEnv.GOOGLE_CLIENT_SECRET) {
    return null;
  }
  return new GoogleCalendarProvider();
}

export function isGoogleCalendarConfigured(): boolean {
  return Boolean(serverEnv.GOOGLE_CLIENT_ID && serverEnv.GOOGLE_CLIENT_SECRET);
}