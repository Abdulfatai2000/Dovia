import { IntegrationProvider, IntegrationStatus } from "@/server/models/integration";

export interface IntegrationConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
}

export interface TokenSet {
  accessToken: string;
  refreshToken?: string;
  expiresAt: Date;
  scopes: string[];
}

export interface ConnectionStatus {
  connected: boolean;
  status: IntegrationStatus;
  providerAccountId?: string;
  expiresAt?: Date;
  error?: string;
}

export interface ExternalCalendarEvent {
  id: string;
  provider: IntegrationProvider;
  externalEventId: string;
  calendarId: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  timezone: string;
  location?: string;
  meetingUrl?: string;
  allDay: boolean;
  readOnly: boolean;
}

export interface BaseProvider {
  readonly provider: IntegrationProvider;
  readonly config: IntegrationConfig;

  getAuthUrl(state: string): string;
  exchangeCodeForTokens(code: string): Promise<TokenSet>;
  refreshAccessToken(refreshToken: string): Promise<TokenSet>;
  getConnectionStatus(tokens: TokenSet): Promise<ConnectionStatus>;
  disconnect(tokens: TokenSet): Promise<void>;
}

export interface CalendarProvider extends BaseProvider {
  listEvents(tokens: TokenSet, calendarId: string, timeMin: Date, timeMax: Date): Promise<ExternalCalendarEvent[]>;
  createEvent(tokens: TokenSet, calendarId: string, event: Partial<ExternalCalendarEvent>): Promise<ExternalCalendarEvent>;
  updateEvent(tokens: TokenSet, calendarId: string, eventId: string, event: Partial<ExternalCalendarEvent>): Promise<ExternalCalendarEvent>;
  deleteEvent(tokens: TokenSet, calendarId: string, eventId: string): Promise<void>;
}

export interface SlackProvider extends BaseProvider {
  listChannels(tokens: TokenSet): Promise<{ id: string; name: string }[]>;
  postMessage(tokens: TokenSet, channelId: string, text: string, blocks?: unknown[]): Promise<{ ts: string }>;
}