"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Toast } from "@/components/ui/toast";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { useSettings } from "@/hooks/use-settings";
import { timezones, updateWorkspaceSettings } from "@/services/settings.service";
import type { WorkspaceSettings } from "@/types/settings";

const dateFormats: WorkspaceSettings["dateFormat"][] = ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"];
const weekStarts: WorkspaceSettings["weekStartsOn"][] = ["Monday", "Sunday"];

export default function WorkspaceForm() {
  const { data, loading, error } = useSettings();
  const [draft, setDraft] = useState<WorkspaceSettings | null>(null);
  const [feedback, setFeedback] = useState<{ variant: "success" | "error"; title: string; description: string } | null>(null);

  if (loading || !data) return <LoadingState label="Loading workspace settings…" />;
  if (error) return <ErrorState description={error} />;

  const current = draft ?? data.workspace;
  const dirty = JSON.stringify(current) !== JSON.stringify(data.workspace);
  const change = <K extends keyof WorkspaceSettings>(key: K, value: WorkspaceSettings[K]) => setDraft({ ...current, [key]: value });

  function save() {
    try { updateWorkspaceSettings(current); setDraft(null); setFeedback({ variant: "success", title: "Workspace settings updated for demo.", description: "Saved in this browser only." }); }
    catch (cause) { setFeedback({ variant: "error", title: "Workspace settings were not saved.", description: cause instanceof Error ? cause.message : "Unable to save your workspace settings." }); }
  }

  return <div className="min-w-0 space-y-6">
    <PageHeader title="Workspace" description="Regional and display preferences for this Dovia demo workspace." />
    <Card className="p-[var(--card-padding)]">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Workspace Name" hideLabel={false} required value={current.name}
          onChange={event => change("name", event.target.value)} wrapperClassName="sm:col-span-2" />
        <Select label="Language" hideLabel={false} value={current.language} disabled
          helperText="Additional languages will be added with backend localisation."
          onChange={event => change("language", event.target.value as WorkspaceSettings["language"])}
          options={[{ value: "English", label: "English" }]} />
        <Select label="Timezone" hideLabel={false} value={current.timezone}
          onChange={event => change("timezone", event.target.value)} options={timezones.map(zone => ({ value: zone, label: zone }))} />
        <Select label="Date Format" hideLabel={false} value={current.dateFormat}
          onChange={event => change("dateFormat", event.target.value as WorkspaceSettings["dateFormat"])}
          options={dateFormats.map(value => ({ value, label: value }))} />
        <Select label="Week Starts On" hideLabel={false} value={current.weekStartsOn}
          onChange={event => change("weekStartsOn", event.target.value as WorkspaceSettings["weekStartsOn"])}
          options={weekStarts.map(value => ({ value, label: value }))} />
        <Select label="Appearance" hideLabel={false} value={current.appearance} disabled
          helperText="Dark mode is not available yet. This option will unlock when the design system supports it."
          onChange={event => change("appearance", event.target.value as WorkspaceSettings["appearance"])}
          options={[{ value: "Light", label: "Light" }]} />
      </div>
    </Card>
    <div className="flex flex-wrap items-center gap-3">
      <Button onClick={save} disabled={!dirty}>Save changes</Button>
      <Button variant="ghost" onClick={() => setDraft(null)} disabled={!dirty}>Discard changes</Button>
      <p className="text-xs text-text-muted">Saved in this browser only. No workspace is created or updated on a server.</p>
    </div>
    {feedback && <div className="fixed right-4 bottom-4 left-4 z-[var(--z-toast)] sm:left-auto">
      <Toast variant={feedback.variant} title={feedback.title} description={feedback.description} onDismiss={() => setFeedback(null)} />
    </div>}
  </div>;
}