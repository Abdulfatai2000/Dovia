export const IntegrationErrorCodes = {
  INTEGRATION_NOT_CONFIGURED: "INTEGRATION_NOT_CONFIGURED",
  INTEGRATION_NOT_CONNECTED: "INTEGRATION_NOT_CONNECTED",
  INTEGRATION_RECONNECT_REQUIRED: "INTEGRATION_RECONNECT_REQUIRED",
  GOOGLE_INTEGRATION_NOT_CONFIGURED: "GOOGLE_INTEGRATION_NOT_CONFIGURED",
  MICROSOFT_INTEGRATION_NOT_CONFIGURED: "MICROSOFT_INTEGRATION_NOT_CONFIGURED",
  SLACK_INTEGRATION_NOT_CONFIGURED: "SLACK_INTEGRATION_NOT_CONFIGURED",
  OAUTH_STATE_INVALID: "OAUTH_STATE_INVALID",
  OAUTH_STATE_EXPIRED: "OAUTH_STATE_EXPIRED",
  TOKEN_EXCHANGE_FAILED: "TOKEN_EXCHANGE_FAILED",
  TOKEN_REFRESH_FAILED: "TOKEN_REFRESH_FAILED",
  PROVIDER_API_ERROR: "PROVIDER_API_ERROR",
} as const;

export type IntegrationErrorCode = (typeof IntegrationErrorCodes)[keyof typeof IntegrationErrorCodes];

export class IntegrationError extends Error {
  constructor(
    public readonly code: IntegrationErrorCode,
    message: string,
    public readonly provider?: string
  ) {
    super(message);
    this.name = "IntegrationError";
  }
}

export function isIntegrationError(error: unknown): error is IntegrationError {
  return error instanceof IntegrationError;
}