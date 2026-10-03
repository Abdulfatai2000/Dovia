"use client";

import { useCallback, useState } from "react";
import { CheckCheck } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs } from "@/components/ui/tabs";
import { Toast } from "@/components/ui/toast";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { useDemoQuery } from "@/hooks/use-demo-query";
import { getNotifications, markAllNotificationsRead, setNotificationRead } from "@/services/notification.service";
import type { NotificationCategory } from "@/types/notification";
import NotificationItem from "./notification-item";

type Category = "All" | NotificationCategory;
const categories: Category[] = ["All", "Tasks", "Meetings", "Mentions", "System"];

export default function NotificationsPage() {
  const load = useCallback(() => getNotifications(), []);
  const { data, loading, error } = useDemoQuery(load);
  const [category, setCategory] = useState<Category>("All");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [feedback, setFeedback] = useState<{ variant: "success" | "error"; title: string; description: string } | null>(null);

  const notifications = data ?? [];
  const unread = notifications.filter(item => !item.read).length;
  const countFor = (name: Category) => name === "All" ? notifications.length : notifications.filter(item => item.category === name).length;
  const visible = notifications.filter(item => (category === "All" || item.category === category) && (!unreadOnly || !item.read));

  function toggleRead(id: string, read: boolean) {
    try { setNotificationRead(id, read); }
    catch (cause) { setFeedback({ variant: "error", title: "Read state was not saved.", description: cause instanceof Error ? cause.message : "Check browser storage access and try again." }); }
  }
  function markAll() {
    try { markAllNotificationsRead(); setFeedback({ variant: "success", title: "All notifications marked as read.", description: "Saved in this browser only." }); }
    catch (cause) { setFeedback({ variant: "error", title: "Notifications were not updated.", description: cause instanceof Error ? cause.message : "Check browser storage access and try again." }); }
  }

  if (loading && !data) return <LoadingState label="Loading notifications…" />;
  if (error || !data) return <div className="space-y-6"><PageHeader title="Notifications" /><ErrorState description={error || "Unable to load notifications."} /></div>;

  return <div className="space-y-6">
    <PageHeader title="Notifications"
      description="Stay updated on meetings, tasks, mentions, and follow-up activity."
      actions={<Button variant="outline" onClick={markAll} disabled={unread === 0}>
        <CheckCheck aria-hidden="true" />Mark all as read
      </Button>} />
    <div className="flex flex-wrap items-center justify-between gap-4">
      <p className="text-xs text-text-muted">
        Generated from your current meetings and tasks. Read state is stored in this browser only.
        {unread > 0 ? ` ${unread} unread.` : " Everything is read."}
      </p>
      <Checkbox label="Unread only" checked={unreadOnly} onChange={event => setUnreadOnly(event.target.checked)} />
    </div>

    <Tabs label="Notification categories" value={category} onValueChange={value => setCategory(value as Category)}
      items={categories.map(name => ({
        value: name,
        label: `${name} (${countFor(name)})`,
        content: visible.length
          ? <ul role="list" className="min-w-0 space-y-3">
            {visible.map(notification => <NotificationItem key={notification.id} notification={notification} onToggleRead={toggleRead} />)}
          </ul>
          : <EmptyState
            title={unreadOnly && notifications.length > 0 ? "No unread notifications" : "You're all caught up"}
            description="New meeting and task updates will appear here." />,
      }))} />

    {feedback && <div className="fixed right-4 bottom-4 left-4 z-[var(--z-toast)] sm:left-auto">
      <Toast variant={feedback.variant} title={feedback.title} description={feedback.description} onDismiss={() => setFeedback(null)} />
    </div>}
  </div>;
}