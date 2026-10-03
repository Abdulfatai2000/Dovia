"use client";

import { useCallback, useMemo, useState } from "react";
import { CalendarDays, ChartNoAxesColumnIncreasing, CircleAlert, CircleCheckBig } from "lucide-react";
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
  return <div className="space-y-6">
    <PageHeader eyebrow="Reports" title="Productivity Reports"
      description="Get insights into your meetings, tasks, and follow-up progress."
      actions={<Select label="Date range" hideLabel wrapperClassName="w-52" value={range}
        onChange={event => setRange(event.target.value as ReportRange)} options={options} />} />
    <p className="text-xs text-text-muted">Selected period · {data.start} to {data.end} · Every figure is calculated in this browser.</p>

    {data.hasData ? <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ReportStatCard label="Meetings Held" value={data.held.length} icon={<CalendarDays aria-hidden="true" />}
          hint={`Selected period · ${data.meetings.length} scheduled or captured`} />
        <ReportStatCard label="Tasks Completed" value={data.stats.completed} icon={<CircleCheckBig aria-hidden="true" />} tone="success"
          hint={`Selected period · ${data.completedInRange.length} completed in range`} />
        <ReportStatCard label="Overdue Tasks" value={data.stats.overdue} icon={<CircleAlert aria-hidden="true" />} tone="danger"
          hint={`Selected period · ${data.stats.overdue} currently overdue`} />
        <ReportStatCard label="Follow-up Completion Rate" value={`${rate.percent}%`} icon={<ChartNoAxesColumnIncreasing aria-hidden="true" />}
          tone={rate.total ? (rate.percent >= 75 ? "success" : "warning") : "default"}
          hint={rate.total ? `${rate.completed} of ${rate.total} follow-up tasks completed` : "No meeting-generated tasks in this period"} />
      </div>

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Card className="p-[var(--card-padding)]">
          <ProductivityChart buckets={data.buckets} title="Meeting Output" description="Number of meetings held over time."
            grouping={`Weekly grouping · ${data.buckets.length} week${data.buckets.length === 1 ? "" : "s"}`} />
        </Card>
        <Card className="p-[var(--card-padding)]">
          <div className="space-y-1">
            <h2 className="dovia-card-title">Task Status</h2>
            <p className="text-sm text-text-secondary">Distribution of tasks from meetings.</p>
          </div>
          <div className="mt-4">
            <TaskStatusChart buckets={data.distribution.buckets} total={data.distribution.total} />
          </div>
        </Card>
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <MeetingFollowUp items={data.followUp.slice(0, 5)} />
        <TeamWorkload entries={data.workload} />
        <ReportInsights insights={data.insights} />
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
    </> : <EmptyState title="No report data yet"
      description="Complete meetings and action items will appear here." />}
  </div>;
}