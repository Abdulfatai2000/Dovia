"use client";

import { CalendarDays, CircleAlert, CircleCheckBig, ListChecks, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { SectionHeader } from "@/components/ui/section-header";
import { ButtonLink } from "@/components/ui/button-link";
import StatCard from "./stat-card";
import UpcomingMeetings from "./upcoming-meetings";
import TaskPreview from "./task-preview";

import { getDashboard } from "@/services/dashboard.service";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";


import { DEMO_TODAY } from "@/lib/task-utils";
import { formatDate } from "@/lib/meeting-format";

import { useDemoQuery } from "@/hooks/use-demo-query";

import TaskActivityFeed from "@/components/tasks/task-activity-feed";

export default function Dashboard() {
  const {data,loading,error}=useDemoQuery(getDashboard);
  if(loading)return <LoadingState label="Loading dashboard..." />;
  if(error||!data)return <ErrorState description={error} />;
  const tasks=data.myTasks,upcoming=data.upcomingMeetings,currentUser=data.currentUser;
  return <div className="space-y-8">
<PageHeader eyebrow="Overview" title={`Good to see you${currentUser ? `, ${currentUser.name}` : ""} 👋`} description="Here's what's happening across your meetings and follow-up work."
      actions={<ButtonLink href="/meetings/new"><Plus aria-hidden="true" />New Meeting</ButtonLink>} />
    <p className="text-xs text-text-muted">Workspace · Today: {formatDate(DEMO_TODAY)} · All times are local.</p>

    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard tone="blue" label="Upcoming Meetings" value={data.upcomingCount} description={loading ? "Loading meetings…" : `${upcoming.filter(m => m.date === DEMO_TODAY).length} scheduled today`} icon={<CalendarDays aria-hidden="true" />} />
      <StatCard tone="violet" label="Open Tasks" value={data.taskStats.open} description="Open follow-up tasks" icon={<ListChecks aria-hidden="true" />} />
      <StatCard tone="orange" label="Overdue" value={data.taskStats.overdue} description="Needs your attention" icon={<CircleAlert aria-hidden="true" />} />
      <StatCard tone="emerald" label="Completed" value={data.taskStats.completed} description="Completed workspace tasks" icon={<CircleCheckBig aria-hidden="true" />} />
    </div>
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      <section className="min-w-0 space-y-5"><SectionHeader title="Upcoming Meetings" action={<ButtonLink href="/meetings" variant="ghost" size="sm">View all</ButtonLink>} /><UpcomingMeetings meetings={upcoming.slice(0,4)} loading={loading} /></section>
      <section className="min-w-0 space-y-5"><SectionHeader title="My Tasks" action={<ButtonLink href="/tasks" variant="ghost" size="sm">View all</ButtonLink>} /><TaskPreview tasks={tasks.slice(0,5)} loading={loading} /></section>
    </div>
    <section className="space-y-5"><SectionHeader title="Recent Activity" description="Recent workspace changes." /><TaskActivityFeed tasks={tasks} activity={data.recentActivity} />

    </section>
  </div>;
}

