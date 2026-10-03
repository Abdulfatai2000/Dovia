"use client";

import { useState } from "react";
import { Toast } from "@/components/ui/toast";
import { IntegrationRow } from "./integration-card";

const integrations = [
  { name: "Google Meet", monogram: "GM", description: "Attach Meet links and calendar events to Dovia meetings." },
  { name: "Microsoft Teams", monogram: "MT", description: "Attach Teams meetings and Outlook events to Dovia meetings." },
  { name: "Zoom", monogram: "ZM", description: "Attach Zoom meeting links and recordings to Dovia meetings." },
  { name: "Slack", monogram: "SL", description: "Share confirmed outcomes and follow-up reminders to a Slack channel." },
];

/** Content only. The surrounding card chrome comes from the settings dashboard/section route. */
export default function IntegrationsSettings() {
  const [notice, setNotice] = useState<{ name: string } | null>(null);
  return <>
    <p className="mb-1 text-xs text-text-muted">No provider credentials are requested, stored, or sent from this frontend.</p>
    <div className="divide-y divide-border">
      {integrations.map(integration => <IntegrationRow key={integration.name} name={integration.name}
        description={integration.description} monogram={integration.monogram}
        onAction={() => setNotice({ name: integration.name })} />)}
    </div>
    {notice && <div className="fixed right-4 bottom-4 left-4 z-[var(--z-toast)] sm:left-auto">
      <Toast variant="info" title="Integration connection will be available during backend development."
        description={`${notice.name} was not connected and no request was sent.`} onDismiss={() => setNotice(null)} />
    </div>}
  </>;
}