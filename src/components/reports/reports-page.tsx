"use client";

import { useCallback, useMemo, useState } from "react";
import { CalendarDays, ChartNoAxesColumnIncreasing, CircleAlert, CircleCheckBig, SquareCheckBig } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { useDemoQuery } from "@/hooks/use-demo-query";
import { getReport, reportRanges, type ReportRange } from "@/services/report.service";
import ReportStatCard from "./report-stat-card";
import ProductivityChart from "./productivity-chart";
import TaskStatusChart from "./task-status-chart";
import MeetingFollowUp from "./meeting-follow-up";
import TeamWorkload from "./team-workload";
import ReportInsights from "./report-insights";

export default function ReportsPage() {
  const [range, setRange] = useState<ReportRange>("Last 30 Days");
  const load = useCallback(() => getReport(range), [range]);
  const { data, loading, error } = useDemoQuery(load);
  const options = useMemo(() => reportRanges.map(value => ({ value, label: value })), []);

  if (loading && !data) return <LoadingState label="Building demo report…" />;
  if (error || !data) return <div className="space-y-6"><PageHeader title="Productivity Reports" /><ErrorState description={error || "Unable to build the demo report."} /></div>;

  const rate = data.followUpRate;
  return <div className="space-y-8">
    <PageHeader eyebrow="Insights" title="Productivity Reports"
      description="Understand how meetings turn into action and where follow-up needs attention."
      actions={<Select label="Date range" hideLabel wrapperClassName="w-52" value={range}
        onChange={event => setRange(event.target.value as ReportRange)} options={options} />} />
    <p className="text-xs text-text-muted">Frontend demo · Every figure is calculated in this browser from your current meetings and tasks.</p>

    {data.hasData ? <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <ReportStatCard label="Meetings Held" value={data.held.length} icon={<CalendarDays aria-hidden="true" />}
          hint={`${data.meetings.length} scheduled or captured in this period`} />
        <ReportStatCard label="Tasks Created" value={data.tasks.length} icon={<SquareCheckBig aria-hidden="true" />} tone="info"
          hint="From confirmed meetings and manual demo tasks" />
        <ReportStatCard label="Tasks Completed" value={data.stats.completed} icon={<CircleCheckBig aria-hidden="true" />} tone="success"
          hint={`${data.completedInRange.length} completed during this period`} />
        <ReportStatCard label="Overdue Tasks" value={data.stats.overdue} icon={<CircleAlert aria-hidden="true" />} tone="danger"
          hint="Open tasks past their due date" />
        <ReportStatCard label="Follow-Up Completion Rate" value={`${rate.percent}%`} icon={<ChartNoAxesColumnIncreasing aria-hidden="true" />}
          tone={rate.percent >= 75 ? "success" : "warning"}
          hint={rate.total ? `${rate.completed} of ${rate.total} follow-up tasks completed` : "No meeting-generated tasks in this period"} />
      </div>

      <Card className="p-[var(--card-padding)]">
        <h2 className="dovia-card-title mb-4">Follow-Up Completion</h2>
        <Progress value={rate.completed} max={rate.total || 1} label="Meeting-generated follow-up tasks" />
        <p className="mt-3 text-sm text-text-secondary">
          {rate.total
            ? `${rate.completed} of ${rate.total} meeting-generated tasks are complete.`
            : "None of the meetings in this period produced action items yet."}
        </p>
      </Card>

      <div className="grid items-start gap-6 xl:grid-cols-2">
        <Card className="p-[var(--card-padding)]"><ProductivityChart buckets={data.buckets} /></Card>
        <Card className="p-[var(--card-padding)]">
          <h2 className="dovia-card-title mb-4">Task Status Distribution</h2>
          <TaskStatusChart buckets={data.distribution.buckets} total={data.distribution.total} />
        </Card>
      </div>

      <MeetingFollowUp items={data.followUp} />
      <TeamWorkload entries={data.workload} />
      <ReportInsights insights={data.insights} />
    </> : <EmptyState title="No report data yet"
      description="Complete meetings and action items will appear here." />}
  </div>;
}