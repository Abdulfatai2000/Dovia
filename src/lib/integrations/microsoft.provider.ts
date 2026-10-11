import { IntegrationProvider } from "@/server/models/integration";
import { BaseProvider, CalendarProvider, IntegrationConfig, TokenSet, ConnectionStatus, ExternalCalendarEvent } from "./provider-contract";
import { serverEnv } from "@/lib/env.server";

const MICROSOFT_AUTH_URL = "https://login.microsoftonline.com";
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
    const tenantId = serverEnv.MICROSOFT_TENANT_ID || "common";
    this.config = {
      clientId: serverEnv.MICROSOFT_CLIENT_ID,
      clientSecret: serverEnv.MICROSOFT_CLIENT_SECRET,
      redirectUri: `${serverEnv.APP_URL}/api/integrations/microsoft/callback`,
      scopes: MICROSOFT_CALENDAR_SCOPES,
    };
  }

  private getAuthEndpoint(): string {
    const tenantId = serverEnv.MICROSOFT_TENANT_ID || "common";
    return `${MICROSOFT_AUTH_URL}/${tenantId}/oauth2/v2.0/authorize`;
  }

  private getTokenEndpoint(): string {
    const tenantId = serverEnv.MICROSOFT_TENANT_ID || "common";
    return `${MICROSOFT_AUTH_URL}/${tenantId}/oauth2/v2.0/token`;
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
    throw new Error("MICROSOFT_INTEGRATION_NOT_CONFIGURED");
  }

  async refreshAccessToken(refreshToken: string): Promise<TokenSet> {
    throw new Error("MICROSOFT_INTEGRATION_NOT_CONFIGURED");
  }

  async getConnectionStatus(tokens: TokenSet): Promise<ConnectionStatus> {
    throw new Error("MICROSOFT_INTEGRATION_NOT_CONFIGURED");
  }

  async disconnect(tokens: TokenSet): Promise<void> {
    throw new Error("MICROSOFT_INTEGRATION_NOT_CONFIGURED");
  }

  async listEvents(tokens: TokenSet, calendarId: string, timeMin: Date, timeMax: Date): Promise<ExternalCalendarEvent[]> {
    throw new Error("MICROSOFT_INTEGRATION_NOT_CONFIGURED");
  }

  async createEvent(tokens: TokenSet, calendarId: string, event: Partial<ExternalCalendarEvent>): Promise<ExternalCalendarEvent> {
    throw new Error("MICROSOFT_INTEGRATION_NOT_CONFIGURED");
  }

  async updateEvent(tokens: TokenSet, calendarId: string, eventId: string, event: Partial<ExternalCalendarEvent>): Promise<ExternalCalendarEvent> {
    throw new Error("MICROSOFT_INTEGRATION_NOT_CONFIGURED");
  }

  async deleteEvent(tokens: TokenSet, calendarId: string, eventId: string): Promise<void> {
    throw new Error("MICROSOFT_INTEGRATION_NOT_CONFIGURED");
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