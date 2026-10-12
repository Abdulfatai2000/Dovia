import { IntegrationProvider } from "@/server/models/integration";
import { BaseProvider, CalendarProvider, IntegrationConfig, TokenSet, ConnectionStatus, ExternalCalendarEvent } from "./provider-contract";
import { serverEnv } from "@/lib/env.server";

const MICROSOFT_AUTH_URL = "https://login.microsoftonline.com";
const MICROSOFT_GRAPH_URL = "https://graph.microsoft.com/v1.0";
const MICROSOFT_CALENDAR_SCOPES = [
  "https://graph.microsoft.com/Calendars.Read",
  "https://graph.microsoft.com/Calendars.ReadWrite",
  "offline_access",
];

export class MicrosoftCalendarProvider implements CalendarProvider {
  readonly provider = IntegrationProvider[1];
  readonly config: IntegrationConfig;

  constructor() {
    if (!serverEnv.MICROSOFT_CLIENT_ID || !serverEnv.MICROSOFT_CLIENT_SECRET) {
      throw new Error("MICROSOFT_INTEGRATION_NOT_CONFIGURED");
    }
    this.config = {
      clientId: serverEnv.MICROSOFT_CLIENT_ID,
      clientSecret: serverEnv.MICROSOFT_CLIENT_SECRET,
      redirectUri: `${serverEnv.APP_URL}/api/integrations/microsoft/callback`,
      scopes: MICROSOFT_CALENDAR_SCOPES,
    };
  }

  private getTenantId(): string {
    return serverEnv.MICROSOFT_TENANT_ID || "common";
  }

  private getAuthEndpoint(): string {
    return `${MICROSOFT_AUTH_URL}/${this.getTenantId()}/oauth2/v2.0/authorize`;
  }

  private getTokenEndpoint(): string {
    return `${MICROSOFT_AUTH_URL}/${this.getTenantId()}/oauth2/v2.0/token`;
  }

  getAuthUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: "code",
      scope: this.config.scopes.join(" "),
      state,
      prompt: "consent",
    });
    return `${this.getAuthEndpoint()}?${params.toString()}`;
  }

  async exchangeCodeForTokens(code: string): Promise<TokenSet> {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: this.config.redirectUri,
    });

    const response = await fetch(this.getTokenEndpoint(), {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`MICROSOFT_OAUTH_FAILED: ${data.error_description || data.error || "Token exchange failed"}`);
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

    const response = await fetch(this.getTokenEndpoint(), {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`MICROSOFT_TOKEN_REFRESH_FAILED: ${data.error_description || data.error || "Token refresh failed"}`);
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
      const response = await fetch(`${MICROSOFT_GRAPH_URL}/me`, {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
      });

      if (!response.ok) {
        return { connected: false, status: "ERROR", error: "Invalid access token" };
      }

      const data = await response.json();
      return {
        connected: true,
        status: "CONNECTED",
        providerAccountId: data.userPrincipalName || data.mail || data.id,
        expiresAt: tokens.expiresAt,
      };
    } catch {
      return { connected: false, status: "ERROR", error: "Failed to verify connection" };
    }
  }

  async disconnect(_tokens: TokenSet): Promise<void> {
    try {
      await fetch(`${MICROSOFT_AUTH_URL}/${this.getTenantId()}/oauth2/v2.0/logout`, {
        method: "POST",
      });
    } catch {
      // Ignore revocation errors - we'll still remove local tokens
    }
  }

  async listCalendars(tokens: TokenSet): Promise<{ id: string; summary: string; primary: boolean; accessRole: string }[]> {
    const response = await fetch(`${MICROSOFT_GRAPH_URL}/me/calendars`, {
      headers: { Authorization: `Bearer ${tokens.accessToken}` },
    });

    if (!response.ok) {
      throw new Error("MICROSOFT_CALENDAR_FETCH_FAILED");
    }

    const data = await response.json();
    return (data.value || []).map((cal: { id: string; name: string; isDefaultCalendar?: boolean; canEdit?: boolean }) => ({
      id: cal.id,
      summary: cal.name,
      primary: cal.isDefaultCalendar || false,
      accessRole: cal.canEdit ? "owner" : "reader",
    }));
  }

  async listEvents(tokens: TokenSet, calendarId: string, timeMin: Date, timeMax: Date): Promise<ExternalCalendarEvent[]> {
    const params = new URLSearchParams({
      $filter: `start/dateTime ge '${timeMin.toISOString()}' and end/dateTime le '${timeMax.toISOString()}'`,
      $orderby: "start/dateTime",
      $top: "100",
    });

    const response = await fetch(`${MICROSOFT_GRAPH_URL}/me/calendars/${encodeURIComponent(calendarId)}/events?${params}`, {
      headers: { Authorization: `Bearer ${tokens.accessToken}` },
    });

    if (!response.ok) {
      throw new Error("MICROSOFT_CALENDAR_FETCH_FAILED");
    }

    const data = await response.json();
    return (data.value || []).map((event: { id: string; subject?: string; bodyPreview?: string; start: { dateTime: string; timeZone: string }; end: { dateTime: string; timeZone: string }; location?: { displayName?: string }; webLink?: string; isAllDay?: boolean; sensitivity?: string }) => {
      const start = new Date(event.start.dateTime);
      const end = new Date(event.end.dateTime);
      const allDay = event.isAllDay || false;

      return {
        id: event.id,
        provider: "MICROSOFT_CALENDAR" as IntegrationProvider,
        externalEventId: event.id,
        calendarId,
        title: event.subject || "(No title)",
        description: event.bodyPreview,
        start,
        end,
        timezone: event.start.timeZone || "UTC",
        location: event.location?.displayName,
        meetingUrl: event.webLink,
        allDay,
        readOnly: event.sensitivity === "private",
      };
    });
  }

  async createEvent(tokens: TokenSet, calendarId: string, event: Partial<ExternalCalendarEvent>): Promise<ExternalCalendarEvent> {
    const graphEvent = this.toGraphEvent(event);

    const response = await fetch(`${MICROSOFT_GRAPH_URL}/me/calendars/${encodeURIComponent(calendarId)}/events`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(graphEvent),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`MICROSOFT_EVENT_CREATE_FAILED: ${error.error?.message || "Failed to create event"}`);
    }

    const created = await response.json();
    return this.fromGraphEvent(created, calendarId);
  }

  async updateEvent(tokens: TokenSet, calendarId: string, eventId: string, event: Partial<ExternalCalendarEvent>): Promise<ExternalCalendarEvent> {
    const graphEvent = this.toGraphEvent(event);

    const response = await fetch(`${MICROSOFT_GRAPH_URL}/me/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(graphEvent),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`MICROSOFT_EVENT_UPDATE_FAILED: ${error.error?.message || "Failed to update event"}`);
    }

    const updated = await response.json();
    return this.fromGraphEvent(updated, calendarId);
  }

  async deleteEvent(tokens: TokenSet, calendarId: string, eventId: string): Promise<void> {
    const response = await fetch(`${MICROSOFT_GRAPH_URL}/me/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${tokens.accessToken}` },
    });

    if (!response.ok && response.status !== 404) {
      throw new Error("MICROSOFT_EVENT_DELETE_FAILED");
    }
  }

  private toGraphEvent(event: Partial<ExternalCalendarEvent>): Record<string, unknown> {
    const graphEvent: Record<string, unknown> = {};

    if (event.title) graphEvent.subject = event.title;
    if (event.description) graphEvent.body = { contentType: "text", content: event.description };
    if (event.location) graphEvent.location = { displayName: event.location };

    if (event.start) {
      if (event.allDay) {
        graphEvent.start = { dateTime: event.start.toISOString(), timeZone: event.timezone || "UTC" };
        graphEvent.end = { dateTime: event.end?.toISOString() || event.start.toISOString(), timeZone: event.timezone || "UTC" };
        graphEvent.isAllDay = true;
      } else {
        graphEvent.start = { dateTime: event.start.toISOString(), timeZone: event.timezone || "UTC" };
        graphEvent.end = { dateTime: (event.end || new Date(event.start.getTime() + 60 * 60 * 1000)).toISOString(), timeZone: event.timezone || "UTC" };
      }
    }

    return graphEvent;
  }

  private fromGraphEvent(event: { id: string; subject?: string; bodyPreview?: string; start: { dateTime: string; timeZone: string }; end: { dateTime: string; timeZone: string }; location?: { displayName?: string }; webLink?: string; isAllDay?: boolean; sensitivity?: string }, calendarId: string): ExternalCalendarEvent {
    const start = new Date(event.start.dateTime);
    const end = new Date(event.end.dateTime);
    const allDay = event.isAllDay || false;

    return {
      id: event.id,
      provider: "MICROSOFT_CALENDAR" as IntegrationProvider,
      externalEventId: event.id,
      calendarId,
      title: event.subject || "(No title)",
      description: event.bodyPreview,
      start,
      end,
      timezone: event.start.timeZone || "UTC",
      location: event.location?.displayName,
      meetingUrl: event.webLink,
      allDay,
      readOnly: event.sensitivity === "private",
    };
  }
}

export function createMicrosoftCalendarProvider(): MicrosoftCalendarProvider | null {
  if (!serverEnv.MICROSOFT_CLIENT_ID || !serverEnv.MICROSOFT_CLIENT_SECRET) {
    return null;
  }
  return new MicrosoftCalendarProvider();
}

export function isMicrosoftCalendarConfigured(): boolean {
  return Boolean(serverEnv.MICROSOFT_CLIENT_ID && serverEnv.MICROSOFT_CLIENT_SECRET);
}