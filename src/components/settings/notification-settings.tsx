"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Toast } from "@/components/ui/toast";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { useSettings } from "@/hooks/use-settings";
import { updateNotificationPreferences } from "@/services/settings.service";
import type { NotificationPreferences } from "@/types/settings";

const preferences: { key: keyof NotificationPreferences; label: string; description: string }[] = [
  { key: "meetingReminders", label: "Meeting reminders", description: "A reminder before a meeting you participate in begins." },
  { key: "taskAssignments", label: "Task assignments", description: "When an action item is assigned to you." },
  { key: "taskDueReminders", label: "Task due reminders", description: "Ahead of a deadline you own." },
  { key: "mentions", label: "Mentions and comments", description: "When someone mentions you in meeting notes or follow-up." },
  { key: "summaries", label: "Meeting summaries", description: "When a meeting summary is ready for your review." },
  { key: "followUps", label: "Follow-up reminders", description: "Nudges for unresolved action items from past meetings." },
  { key: "productUpdates", label: "Product updates", description: "Occasional notes about changes to Dovia." },
];

/** Content only. The surrounding card chrome comes from the settings dashboard/section route. */
export default function NotificationSettings() {
  const { data, loading, error } = useSettings();
  const [draft, setDraft] = useState<NotificationPreferences | null>(null);
  const [feedback, setFeedback] = useState<{ variant: "success" | "error"; title: string; description: string } | null>(null);

  if (error) return <ErrorState description={error} />;
  if (loading || !data) return <LoadingState label="Loading notification preferencesâ€¦" />;

  const current = draft ?? data.notifications;
  const dirty = JSON.stringify(current) !== JSON.stringify(data.notifications);

  function toggle(key: keyof NotificationPreferences, value: boolean) { setDraft({ ...current, [key]: value }); }
  function save() {
    try { updateNotificationPreferences(current); setDraft(null); setFeedback({ variant: "success", title: "Notification preferences updated for demo.", description: "Saved in this browser only." }); }
    catch (cause) { setFeedback({ variant: "error", title: "Preferences were not saved.", description: cause instanceof Error ? cause.message : "Unable to save your preferences." }); }
  }

  return <>
    <div className="divide-y divide-border">
      {preferences.map(preference => <div key={preference.key} className="py-3 first:pt-0 last:pb-0">
        <Checkbox id={`pref-${preference.key}`} label={preference.label} helperText={preference.description}
          checked={current[preference.key]} onChange={event => toggle(preference.key, event.target.checked)} />
      </div>)}
    </div>
    <div className="mt-5 flex flex-wrap items-center gap-3">
      <Button onClick={save} disabled={!dirty}>Save changes</Button>
      <Button variant="ghost" onClick={() => setDraft(null)} disabled={!dirty}>Discard changes</Button>
      <p className="text-xs text-text-muted">Saved in this browser only. No emails or push notifications are sent.</p>
    </div>
    {feedback && <div className="fixed right-4 bottom-4 left-4 z-[var(--z-toast)] sm:left-auto">
      <Toast variant={feedback.variant} title={feedback.title} description={feedback.description} onDismiss={() => setFeedback(null)} />
    </div>}
  </>;
}
