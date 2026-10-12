"use client";

import { useState } from "react";
import { Toast } from "@/components/ui/toast";
import { IntegrationRow } from "./integration-card";
import { useIntegrationStatus, IntegrationStatusInfo } from "@/hooks/use-integrations";

const providerInfo: Record<string, { monogram: string; description: string; displayName: string }> = {
  GOOGLE_CALENDAR: {
    monogram: "GC",
    displayName: "Google Calendar",
    description: "Sync meetings and events with Google Calendar.",
  },
  MICROSOFT_CALENDAR: {
    monogram: "MC",
    displayName: "Microsoft Calendar",
    description: "Sync meetings and events with Outlook Calendar.",
  },
  SLACK: {
    monogram: "SL",
    displayName: "Slack",
    description: "Share meeting outcomes and follow-ups to Slack channels.",
  },
};

function getStatusDisplay(status: IntegrationStatusInfo) {
  const info = providerInfo[status.provider];
  if (!info) return { label: "Unknown", tone: "neutral" as const, actionLabel: "Connect" };

  if (!status.configured) {
    return {
      label: "Not configured",
      tone: "neutral" as const,
      actionLabel: "Configure",
      disabled: true,
    };
  }

  switch (status.status) {
    case "CONNECTED":
      return {
        label: `Connected (${status.providerAccountId || "active"})`,
        tone: "info" as const,
        actionLabel: "Disconnect",
        disabled: false,
      };
    case "RECONNECT_REQUIRED":
      return {
        label: "Reconnect required",
        tone: "neutral" as const,
        actionLabel: "Reconnect",
        disabled: false,
      };
    case "ERROR":
      return {
        label: `Error: ${status.error || "Unknown error"}`,
        tone: "neutral" as const,
        actionLabel: "Reconnect",
        disabled: false,
      };
    default:
      return {
        label: "Not connected",
        tone: "neutral" as const,
        actionLabel: "Connect",
        disabled: false,
      };
  }
}

async function handleGoogleConnect() {
  try {
    const response = await fetch("/api/integrations/google/connect");
    const data = await response.json();
    if (data.authUrl) {
      window.location.href = data.authUrl;
    }
  } catch {
    // Error handled by toast
  }
}

async function handleGoogleDisconnect() {
  try {
    await fetch("/api/integrations/google/disconnect", { method: "POST" });
    window.location.reload();
  } catch {
    // Error handled by toast
  }
}

async function handleMicrosoftAction() {
  // Placeholder for Microsoft
}

async function handleSlackAction() {
  // Placeholder for Slack
}

/** Content only. The surrounding card chrome comes from the settings dashboard/section route. */
export default function IntegrationsSettings() {
  const [notice, setNotice] = useState<{ name: string } | null>(null);
  const { data: integrationStatus, loading: isLoading } = useIntegrationStatus();

  const providers = ["GOOGLE_CALENDAR", "MICROSOFT_CALENDAR", "SLACK"] as const;

  if (isLoading) {
    return (
      <div className="divide-y divide-border">
        {providers.map((provider) => {
          const info = providerInfo[provider];
          return (
            <div key={provider} className="flex flex-wrap items-center gap-3 py-4 animate-pulse">
              <span aria-hidden="true" className="dovia-gradient-ai flex size-10 shrink-0 items-center justify-center rounded-md text-sm font-semibold text-on-brand shadow-glow-ai">{info.monogram}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{info.displayName}</p>
                <p className="mt-0.5 text-xs text-text-secondary">{info.description}</p>
              </div>
              <div className="h-5 bg-surface-soft rounded w-32" />
              <div className="h-8 bg-surface-soft rounded w-20" />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <>
      <p className="mb-1 text-xs text-text-muted">Provider credentials are configured in environment variables. No tokens are stored in the browser.</p>
      <div className="divide-y divide-border">
        {providers.map((provider) => {
          const status = integrationStatus?.find((s) => s.provider === provider);
          const display = status ? getStatusDisplay(status) : { label: "Unknown", tone: "neutral" as const, actionLabel: "Connect", disabled: true };
          const info = providerInfo[provider];
          let onAction: () => void;
          if (provider === "GOOGLE_CALENDAR") {
            onAction = status?.status === "CONNECTED" ? handleGoogleDisconnect : handleGoogleConnect;
          } else if (provider === "MICROSOFT_CALENDAR") {
            onAction = handleMicrosoftAction;
          } else {
            onAction = handleSlackAction;
          }
          return (
            <IntegrationRow
              key={provider}
              name={info.displayName}
              description={info.description}
              monogram={info.monogram}
              status={display.label}
              statusTone={display.tone}
              actionLabel={display.actionLabel}
              disabled={display.disabled}
              onAction={onAction}
            />
          );
        })}
      </div>
      {notice && (
        <div className="fixed right-4 bottom-4 left-4 z-[var(--z-toast)] sm:left-auto">
          <Toast
            variant="info"
            title="Integration connection will be available during backend development."
            description={`${notice.name} was not connected and no request was sent.`}
            onDismiss={() => setNotice(null)}
          />
        </div>
      )}
    </>
  );
}