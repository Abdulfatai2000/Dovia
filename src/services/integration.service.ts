import { connectToDatabase } from "@/lib/db/mongoose";
import { Integration, IntegrationProvider, IntegrationStatus } from "@/server/models/integration";
import { encryptSecret, decryptSecret } from "@/lib/encryption";
import { isGoogleCalendarConfigured, isMicrosoftCalendarConfigured, isSlackConfigured } from "@/lib/integrations";

export interface IntegrationStatusInfo {
  provider: IntegrationProvider;
  configured: boolean;
  connected: boolean;
  status: IntegrationStatus;
  providerAccountId?: string;
  tokenExpiresAt?: Date | null;
  error?: string;
}

export interface IntegrationTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt: Date;
  scopes: string[];
}

async function getIntegrationModel() {
  await connectToDatabase();
  return Integration;
}

export async function getIntegrationStatus(workspaceId: string): Promise<IntegrationStatusInfo[]> {
  const IntegrationModel = await getIntegrationModel();
  const integrations = await IntegrationModel.find({ workspaceId }).lean();

  const googleConfigured = isGoogleCalendarConfigured();
  const microsoftConfigured = isMicrosoftCalendarConfigured();
  const slackConfigured = isSlackConfigured();

  const providers: IntegrationProvider[] = ["GOOGLE_CALENDAR", "MICROSOFT_CALENDAR", "SLACK"];
  const configuredMap: Record<IntegrationProvider, boolean> = {
    GOOGLE_CALENDAR: googleConfigured,
    MICROSOFT_CALENDAR: microsoftConfigured,
    SLACK: slackConfigured,
  };

  return providers.map((provider) => {
    const integration = integrations.find((i) => i.provider === provider);
    const configured = configuredMap[provider];
    return {
      provider,
      configured,
      connected: integration?.status === "CONNECTED",
      status: integration?.status || "DISCONNECTED",
      providerAccountId: integration?.providerAccountId,
      tokenExpiresAt: integration?.tokenExpiresAt,
      error: integration?.status === "ERROR" ? "Connection error" : undefined,
    };
  });
}

export async function getIntegration(workspaceId: string, provider: IntegrationProvider) {
  const IntegrationModel = await getIntegrationModel();
  const integration = await IntegrationModel.findOne({ workspaceId, provider }).lean();
  if (!integration) return null;

  return {
    ...integration,
    encryptedAccessToken: undefined,
    encryptedRefreshToken: undefined,
  };
}

export async function saveIntegration(
  workspaceId: string,
  userId: string,
  provider: IntegrationProvider,
  providerAccountId: string,
  tokens: { accessToken: string; refreshToken?: string; expiresAt: Date; scopes: string[] }
) {
  const IntegrationModel = await getIntegrationModel();

  const encryptedAccessToken = encryptSecret(tokens.accessToken);
  const encryptedRefreshToken = tokens.refreshToken ? encryptSecret(tokens.refreshToken) : undefined;

  const integration = await IntegrationModel.findOneAndUpdate(
    { workspaceId, provider },
    {
      workspaceId,
      userId,
      provider,
      providerAccountId,
      encryptedAccessToken,
      encryptedRefreshToken,
      tokenExpiresAt: tokens.expiresAt,
      scopes: tokens.scopes,
      status: "CONNECTED",
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return {
    ...integration.toObject(),
    encryptedAccessToken: undefined,
    encryptedRefreshToken: undefined,
  };
}

export async function disconnectIntegration(workspaceId: string, provider: IntegrationProvider) {
  const IntegrationModel = await getIntegrationModel();
  await IntegrationModel.findOneAndDelete({ workspaceId, provider });
}

export async function markReconnectRequired(workspaceId: string, provider: IntegrationProvider) {
  const IntegrationModel = await getIntegrationModel();
  await IntegrationModel.findOneAndUpdate(
    { workspaceId, provider },
    { status: "RECONNECT_REQUIRED" }
  );
}

export async function getDecryptedTokens(workspaceId: string, provider: IntegrationProvider): Promise<IntegrationTokens | null> {
  const IntegrationModel = await getIntegrationModel();
  const integration = await IntegrationModel.findOne({ workspaceId, provider }).select("+encryptedAccessToken +encryptedRefreshToken").lean();
  if (!integration || !integration.encryptedAccessToken) return null;

  return {
    accessToken: decryptSecret(integration.encryptedAccessToken),
    refreshToken: integration.encryptedRefreshToken ? decryptSecret(integration.encryptedRefreshToken) : undefined,
    expiresAt: integration.tokenExpiresAt || new Date(),
    scopes: integration.scopes || [],
  };
}

export async function updateIntegrationTokens(
  workspaceId: string,
  provider: IntegrationProvider,
  tokens: { accessToken: string; refreshToken?: string; expiresAt: Date }
) {
  const IntegrationModel = await getIntegrationModel();
  const encryptedAccessToken = encryptSecret(tokens.accessToken);
  const encryptedRefreshToken = tokens.refreshToken ? encryptSecret(tokens.refreshToken) : undefined;

  await IntegrationModel.findOneAndUpdate(
    { workspaceId, provider },
    {
      encryptedAccessToken,
      encryptedRefreshToken,
      tokenExpiresAt: tokens.expiresAt,
      status: "CONNECTED",
    }
  );
}