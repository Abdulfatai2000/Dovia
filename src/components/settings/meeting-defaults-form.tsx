"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select } from "@/components/ui/select";
import { Toast } from "@/components/ui/toast";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { useSettings } from "@/hooks/use-settings";
import { updateMeetingDefaults } from "@/services/settings.service";
import { meetingTypes, platforms } from "@/data/mock/meetings";
import type { MeetingDefaults } from "@/types/settings";

const durations = [15, 30, 45, 60, 90, 120];
const reminders = [0, 5, 15, 30, 60];

export default function MeetingDefaultsForm() {
  const { data, loading, error } = useSettings();
  const [draft, setDraft] = useState<MeetingDefaults | null>(null);
  const [feedback, setFeedback] = useState<{ variant: "success" | "error"; title: string; description: string } | null>(null);

  if (loading || !data) return <LoadingState label="Loading meeting defaults…" />;
  if (error) return <ErrorState description={error} />;

  const current = draft ?? data.meetingDefaults;
  const dirty = JSON.stringify(current) !== JSON.stringify(data.meetingDefaults);
  const change = <K extends keyof MeetingDefaults>(key: K, value: MeetingDefaults[K]) => setDraft({ ...current, [key]: value });

  function save() {
    try { updateMeetingDefaults(current); setDraft(null); setFeedback({ variant: "success", title: "Meeting defaults updated for demo.", description: "Saved in this browser only." }); }
    catch (cause) { setFeedback({ variant: "error", title: "Defaults were not saved.", description: cause instanceof Error ? cause.message : "Unable to save your defaults." }); }
  }

  return <div className="min-w-0 space-y-6">
    <PageHeader title="Meeting Defaults" description="Prefill new meetings with the settings your team uses most." />
    <Card className="p-[var(--card-padding)]">
      <div className="grid gap-4 sm:grid-cols-2">
        <Select label="Default meeting duration" hideLabel={false} value={String(current.duration)}
          onChange={event => change("duration", Number(event.target.value))}
          options={durations.map(value => ({ value: String(value), label: `${value} minutes` }))} />
        <Select label="Default reminder time" hideLabel={false} value={String(current.reminder)}
          onChange={event => change("reminder", Number(event.target.value))}
          options={reminders.map(value => ({ value: String(value), label: value === 0 ? "At start time" : `${value} minutes before` }))} />
        <Select label="Default meeting type" hideLabel={false} value={current.meetingType}
          onChange={event => change("meetingType", event.target.value)} options={meetingTypes.map(value => ({ value, label: value }))} />
        <Select label="Default platform" hideLabel={false} value={current.platform}
          onChange={event => change("platform", event.target.value)} options={platforms.map(value => ({ value, label: value }))} />
      </div>
      <div className="mt-5 space-y-4 border-t border-border pt-5">
        <Checkbox id="auto-open-review" label="Auto-open AI review after content"
          helperText="Open the review step as soon as meeting content has been added."
          checked={current.autoOpenReview} onChange={event => change("autoOpenReview", event.target.checked)} />
        <Checkbox id="auto-generate" label="Auto-generate meeting analysis"
          helperText="This preference will apply when AI processing is connected."
          checked={current.autoGenerate} onChange={event => change("autoGenerate", event.target.checked)} />
      </div>
    </Card>
    <div className="flex flex-wrap items-center gap-3">
      <Button onClick={save} disabled={!dirty}>Save changes</Button>
      <Button variant="ghost" onClick={() => setDraft(null)} disabled={!dirty}>Discard changes</Button>
      <p className="text-xs text-text-muted">Saved in this browser only. Defaults are not enforced by a backend yet.</p>
    </div>
    {feedback && <div className="fixed right-4 bottom-4 left-4 z-[var(--z-toast)] sm:left-auto">
      <Toast variant={feedback.variant} title={feedback.title} description={feedback.description} onDismiss={() => setFeedback(null)} />
    </div>}
  </div>;
}