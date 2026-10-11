import { IntegrationProvider } from "@/server/models/integration";
import { BaseProvider, CalendarProvider, IntegrationConfig, TokenSet, ConnectionStatus, ExternalCalendarEvent } from "./provider-contract";
import { serverEnv } from "@/lib/env.server";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_CALENDAR_SCOPES = [
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/calendar.readonly",
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
    throw new Error("GOOGLE_INTEGRATION_NOT_CONFIGURED");
  }

  async refreshAccessToken(refreshToken: string): Promise<TokenSet> {
    throw new Error("GOOGLE_INTEGRATION_NOT_CONFIGURED");
  }

  async getConnectionStatus(tokens: TokenSet): Promise<ConnectionStatus> {
    throw new Error("GOOGLE_INTEGRATION_NOT_CONFIGURED");
  }

  async disconnect(tokens: TokenSet): Promise<void> {
    throw new Error("GOOGLE_INTEGRATION_NOT_CONFIGURED");
  }

  async listEvents(tokens: TokenSet, calendarId: string, timeMin: Date, timeMax: Date): Promise<ExternalCalendarEvent[]> {
    throw new Error("GOOGLE_INTEGRATION_NOT_CONFIGURED");
  }

  async createEvent(tokens: TokenSet, calendarId: string, event: Partial<ExternalCalendarEvent>): Promise<ExternalCalendarEvent> {
    throw new Error("GOOGLE_INTEGRATION_NOT_CONFIGURED");
  }

  async updateEvent(tokens: TokenSet, calendarId: string, eventId: string, event: Partial<ExternalCalendarEvent>): Promise<ExternalCalendarEvent> {
    throw new Error("GOOGLE_INTEGRATION_NOT_CONFIGURED");
  }

  async deleteEvent(tokens: TokenSet, calendarId: string, eventId: string): Promise<void> {
    throw new Error("GOOGLE_INTEGRATION_NOT_CONFIGURED");
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