export type { IntegrationProvider, IntegrationStatus } from "@/server/models/integration";
export type {
  IntegrationConfig,
  TokenSet,
  ConnectionStatus,
  ExternalCalendarEvent,
  BaseProvider,
  CalendarProvider,
  SlackProvider,
} from "./provider-contract";

export { GoogleCalendarProvider, createGoogleCalendarProvider, isGoogleCalendarConfigured } from "./google.provider";
export { MicrosoftCalendarProvider, createMicrosoftCalendarProvider, isMicrosoftCalendarConfigured } from "./microsoft.provider";
export { SlackProviderImpl, createSlackProvider, isSlackConfigured } from "./slack.provider";

export { IntegrationErrorCodes, IntegrationError, isIntegrationError } from "./errors";
export { generateOAuthState, validateOAuthState, getOAuthRedirectUri } from "./oauth-state";