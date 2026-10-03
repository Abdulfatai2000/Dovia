"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Toast } from "@/components/ui/toast";
import IntegrationCard from "./integration-card";

const integrations = [
  { name: "Google Meet", monogram: "GM", description: "Attach Meet links and calendar events to Dovia meetings." },
  { name: "Microsoft Teams", monogram: "MT", description: "Attach Teams meetings and Outlook events to Dovia meetings." },
  { name: "Zoom", monogram: "ZM", description: "Attach Zoom meeting links and recordings to Dovia meetings." },
  { name: "Slack", monogram: "SL", description: "Share confirmed outcomes and follow-up reminders to a Slack channel." },
];

export default function IntegrationsSettings() {
  const [notice, setNotice] = useState<{ name: string } | null>(null);
  return <div className="min-w-0 space-y-6">
    <PageHeader title="Integrations" description="Connect the tools your team already uses. Connections are not available yet." />
    <p className="text-xs text-text-muted">No provider credentials are requested, stored, or sent from this frontend.</p>
    <div className="grid gap-4 sm:grid-cols-2">
      {integrations.map(integration => <IntegrationCard key={integration.name} name={integration.name}
        description={integration.description} monogram={integration.monogram} status="Coming Soon" statusTone="info"
        onAction={() => setNotice({ name: integration.name })} />)}
    </div>
    {notice && <div className="fixed right-4 bottom-4 left-4 z-[var(--z-toast)] sm:left-auto">
      <Toast variant="info" title="Integration connection will be available during backend development."
        description={`${notice.name} was not connected and no request was sent.`} onDismiss={() => setNotice(null)} />
    </div>}
  </div>;
}