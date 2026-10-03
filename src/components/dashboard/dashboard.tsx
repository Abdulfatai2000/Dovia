"use client";

import { CalendarDays, CircleAlert, CircleCheckBig, ListChecks, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { SectionHeader } from "@/components/ui/section-header";
import { ButtonLink } from "@/components/ui/button-link";
import StatCard from "./stat-card";
import UpcomingMeetings from "./upcoming-meetings";
import TaskPreview from "./task-preview";
import ActivityFeed from "./activity-feed";
import { useTasks } from "@/hooks/use-tasks";
import { CURRENT_USER_ID, isTaskOverdue } from "@/lib/task-utils";
import { activities } from "@/data/mock/activities";
import { DEMO_TODAY } from "@/data/mock/meetings";
import { formatDate } from "@/lib/meeting-format";
import { useMeetings } from "@/hooks/use-meetings";

export default function Dashboard() {
  const { meetings, loading, error } = useMeetings();
  const taskState = useTasks();
  const tasks = taskState.tasks.filter(task => task.assigneeId === CURRENT_USER_ID);
  const upcoming = meetings.filter(m => ["SCHEDULED", "IN_PROGRESS"].includes(m.status) && m.date >= DEMO_TODAY).sort((a,b) => (a.date + a.startTime).localeCompare(b.date + b.startTime));
  return <div className="space-y-8">
<PageHeader eyebrow="Overview" title="Good to see you, Abdulfatai 👋" description="Here's what's happening across your meetings and follow-up work."
      actions={<ButtonLink href="/meetings/new"><Plus aria-hidden="true" />New Meeting</ButtonLink>} />
    <p className="text-xs text-text-muted">Demo workspace · Sample calendar: {formatDate(DEMO_TODAY)} · All times are local.</p>
    {(error || taskState.error) && <p role="alert" className="text-sm text-danger-foreground">{error || taskState.error}</p>}
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard label="Upcoming Meetings" value={upcoming.length} description={loading ? "Loading demo meetings…" : `${upcoming.filter(m => m.date === DEMO_TODAY).length} on the demo calendar today`} icon={<CalendarDays aria-hidden="true" className="size-5 text-primary" />} />
      <StatCard label="My Tasks" value={tasks.filter(t => t.status !== "COMPLETED").length} description="Open follow-up tasks" icon={<ListChecks aria-hidden="true" className="size-5 text-ai" />} />
      <StatCard label="Overdue" value={tasks.filter(isTaskOverdue).length} description="Needs your attention" icon={<CircleAlert aria-hidden="true" className="size-5 text-danger-foreground" />} />
      <StatCard label="Completed" value={tasks.filter(t => t.status === "COMPLETED").length} description="Completed demo tasks" icon={<CircleCheckBig aria-hidden="true" className="size-5 text-success-foreground" />} />
    </div>
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      <section className="min-w-0 space-y-5"><SectionHeader title="Upcoming Meetings" action={<ButtonLink href="/meetings" variant="ghost" size="sm">View all</ButtonLink>} /><UpcomingMeetings meetings={upcoming.slice(0,4)} loading={loading} /></section>
      <section className="min-w-0 space-y-5"><SectionHeader title="My Tasks" action={<ButtonLink href="/tasks" variant="ghost" size="sm">View all</ButtonLink>} /><TaskPreview tasks={tasks.slice(0,5)} loading={taskState.loading} /></section>
    </div>
    <section className="space-y-5"><SectionHeader title="Recent Activity" description="A snapshot of your team's demo activity." /><ActivityFeed activities={activities} /></section>
  </div>;
}

