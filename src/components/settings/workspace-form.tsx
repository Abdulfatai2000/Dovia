"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Toast } from "@/components/ui/toast";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { useSettings } from "@/hooks/use-settings";
import { timezones, updateWorkspaceSettings } from "@/services/settings.service";
import { themeModes, useThemeMode, type ThemeMode } from "@/components/theme/theme-toggle";
import type { WorkspaceSettings } from "@/types/settings";

const dateFormats: WorkspaceSettings["dateFormat"][] = ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"];
const weekStarts: WorkspaceSettings["weekStartsOn"][] = ["Monday", "Sunday"];

/** Content only. The surrounding card chrome comes from the settings dashboard/section route. */
export default function WorkspaceForm() {
  const { data, loading, error } = useSettings();
  const { mode, resolvedTheme, setTheme } = useThemeMode();
  const [draft, setDraft] = useState<WorkspaceSettings | null>(null);
  const [feedback, setFeedback] = useState<{ variant: "success" | "error"; title: string; description: string } | null>(null);

  if (error) return <ErrorState description={error} />;
  if (loading || !data) return <LoadingState label="Loading workspace settingsâ€¦" />;

  const current = draft ?? data.workspace;
  const dirty = JSON.stringify(current) !== JSON.stringify(data.workspace);
  const change = <K extends keyof WorkspaceSettings>(key: K, value: WorkspaceSettings[K]) => setDraft({ ...current, [key]: value });

  function save() {
    try { updateWorkspaceSettings(current); setDraft(null); setFeedback({ variant: "success", title: "Workspace settings updated for demo.", description: "Saved in this browser only." }); }
    catch (cause) { setFeedback({ variant: "error", title: "Workspace settings were not saved.", description: cause instanceof Error ? cause.message : "Unable to save your workspace settings." }); }
  }

  return <>
    <div className="grid gap-4 sm:grid-cols-2">
      <Input label="Workspace Name" hideLabel={false} required value={current.name}
        onChange={event => change("name", event.target.value)} wrapperClassName="sm:col-span-2" />
      <Select label="Language" hideLabel={false} value={current.language} disabled
        helperText="Additional languages arrive with backend localisation."
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
    </div>
    <fieldset className="mt-5">
      <legend className="text-sm font-medium text-foreground">Appearance</legend>
      <p className="mt-1 mb-3 text-xs text-text-muted">
        Light, Dark, or follow your device. This is the same theme used across Dovia and is remembered in this browser.
      </p>
      <div className="grid gap-2 sm:grid-cols-3">
        {themeModes.map(entry => {
          const Icon = entry.icon;
          const selected = mode === entry.value;
          return <button key={entry.value} type="button" onClick={() => setTheme(entry.value as ThemeMode)}
            aria-pressed={selected}
            className={`flex min-h-16 flex-col items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-[transform,box-shadow,border-color,background-color] duration-200 ease-out ${selected ? "dovia-accent-border -translate-y-0.5 border-blue bg-gradient-to-br from-blue/12 to-violet/10 shadow-glow" : "border-border bg-surface text-text-secondary hover:-translate-y-0.5 hover:border-border-strong hover:shadow-sm"}`}>
            <Icon aria-hidden="true" className={`size-5 ${selected ? "text-primary" : "text-text-muted"}`} />
            <span className={selected ? "text-primary" : undefined}>{entry.label}</span>
            {entry.value === "system" && resolvedTheme && <span className="text-xs font-normal text-text-muted">Currently {resolvedTheme}</span>}
          </button>;
        })}
      </div>
    </fieldset>
    <div className="mt-5 flex flex-wrap items-center gap-3">
      <Button onClick={save} disabled={!dirty}>Save changes</Button>
      <Button variant="ghost" onClick={() => setDraft(null)} disabled={!dirty}>Discard changes</Button>
      <p className="text-xs text-text-muted">Saved in this browser only. No workspace is created or updated on a server.</p>
    </div>
    {feedback && <div className="fixed right-4 bottom-4 left-4 z-[var(--z-toast)] sm:left-auto">
      <Toast variant={feedback.variant} title={feedback.title} description={feedback.description} onDismiss={() => setFeedback(null)} />
    </div>}
  </>;
}
