import { IntegrationProvider } from "@/server/models/integration";
import { BaseProvider, SlackProvider, IntegrationConfig, TokenSet, ConnectionStatus } from "./provider-contract";
import { serverEnv } from "@/lib/env.server";

const SLACK_AUTH_URL = "https://slack.com/oauth/v2/authorize";
const SLACK_TOKEN_URL = "https://slack.com/api/oauth.v2.access";
const SLACK_SCOPES = [
  "channels:read",
  "channels:join",
  "chat:write",
  "chat:write.public",
  "incoming-webhook",
];

export class SlackProviderImpl implements SlackProvider {
  readonly provider = IntegrationProvider[2];
  readonly config: IntegrationConfig;

  constructor() {
    if (!serverEnv.SLACK_CLIENT_ID || !serverEnv.SLACK_CLIENT_SECRET) {
      throw new Error("SLACK_INTEGRATION_NOT_CONFIGURED");
    }
    this.config = {
      clientId: serverEnv.SLACK_CLIENT_ID,
      clientSecret: serverEnv.SLACK_CLIENT_SECRET,
      redirectUri: `${serverEnv.APP_URL}/api/integrations/slack/callback`,
      scopes: SLACK_SCOPES,
    };
  }

  getAuthUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: this.config.scopes.join(","),
      state,
      user_scope: this.config.scopes.join(","),
    });
    return `${SLACK_AUTH_URL}?${params.toString()}`;
  }

  async exchangeCodeForTokens(code: string): Promise<TokenSet> {
    throw new Error("SLACK_INTEGRATION_NOT_CONFIGURED");
  }

  async refreshAccessToken(refreshToken: string): Promise<TokenSet> {
    throw new Error("SLACK_INTEGRATION_NOT_CONFIGURED");
  }

  async getConnectionStatus(tokens: TokenSet): Promise<ConnectionStatus> {
    throw new Error("SLACK_INTEGRATION_NOT_CONFIGURED");
  }

  async disconnect(tokens: TokenSet): Promise<void> {
    throw new Error("SLACK_INTEGRATION_NOT_CONFIGURED");
  }

  async listChannels(tokens: TokenSet): Promise<{ id: string; name: string }[]> {
    throw new Error("SLACK_INTEGRATION_NOT_CONFIGURED");
  }

  async postMessage(tokens: TokenSet, channelId: string, text: string, blocks?: unknown[]): Promise<{ ts: string }> {
    throw new Error("SLACK_INTEGRATION_NOT_CONFIGURED");
  }
}

export function createSlackProvider(): SlackProviderImpl | null {
  if (!serverEnv.SLACK_CLIENT_ID || !serverEnv.SLACK_CLIENT_SECRET) {
    return null;
  }
  return new SlackProviderImpl();
}

export function isSlackConfigured(): boolean {
  return Boolean(serverEnv.SLACK_CLIENT_ID && serverEnv.SLACK_CLIENT_SECRET);
}