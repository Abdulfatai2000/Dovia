import { randomBytes } from "crypto";
import { serverEnv } from "@/lib/env.server";

const STATE_PREFIX = "dovia_oauth_";
const STATE_TTL_MS = 10 * 60 * 1000;

interface OAuthStatePayload {
  userId: string;
  workspaceId: string;
  provider: string;
  createdAt: number;
  nonce: string;
}

export function generateOAuthState(userId: string, workspaceId: string, provider: string): string {
  const payload: OAuthStatePayload = {
    userId,
    workspaceId,
    provider,
    createdAt: Date.now(),
    nonce: randomBytes(16).toString("base64url"),
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${STATE_PREFIX}${encoded}`;
}

export function validateOAuthState(state: string): OAuthStatePayload | null {
  if (!state || !state.startsWith(STATE_PREFIX)) {
    return null;
  }
  try {
    const encoded = state.slice(STATE_PREFIX.length);
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as OAuthStatePayload;
    if (Date.now() - payload.createdAt > STATE_TTL_MS) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export function getOAuthRedirectUri(provider: string): string {
  return `${serverEnv.APP_URL}/api/integrations/${provider.toLowerCase()}/callback`;
}