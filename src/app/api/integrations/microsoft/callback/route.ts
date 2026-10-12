import { connectToDatabase } from "@/lib/db/mongoose";
import { createMicrosoftCalendarProvider } from "@/lib/integrations/microsoft.provider";
import { validateOAuthState } from "@/lib/integrations/oauth-state";
import { saveIntegration } from "@/services/integration.service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (error) {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      return Response.redirect(`${baseUrl}/settings/integrations?error=microsoft_oauth_denied`);
    }

    if (!code || !state) {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      return Response.redirect(`${baseUrl}/settings/integrations?error=microsoft_oauth_invalid`);
    }

    const payload = validateOAuthState(state);
    if (!payload) {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      return Response.redirect(`${baseUrl}/settings/integrations?error=microsoft_oauth_state_invalid`);
    }

    const provider = createMicrosoftCalendarProvider();
    if (!provider) {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      return Response.redirect(`${baseUrl}/settings/integrations?error=microsoft_not_configured`);
    }

    const tokens = await provider.exchangeCodeForTokens(code);

    const status = await provider.getConnectionStatus(tokens);
    if (!status.connected || !status.providerAccountId) {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      return Response.redirect(`${baseUrl}/settings/integrations?error=microsoft_connection_failed`);
    }

    await connectToDatabase();
    await saveIntegration(
      payload.workspaceId,
      payload.userId,
      "MICROSOFT_CALENDAR",
      status.providerAccountId,
      {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt: tokens.expiresAt,
        scopes: tokens.scopes,
      }
    );

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return Response.redirect(`${baseUrl}/settings/integrations?connected=microsoft`);
  } catch (error) {
    console.error("Microsoft callback error:", error);

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return Response.redirect(`${baseUrl}/settings/integrations?error=microsoft_callback_failed`);
  }
}