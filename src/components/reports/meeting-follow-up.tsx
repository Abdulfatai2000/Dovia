import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeader } from "@/components/ui/section-header";
import { formatDate } from "@/lib/meeting-format";
import type { Meeting } from "@/types/meeting";
import type { Task } from "@/types/task";

export interface MeetingFollowUpItem { meeting: Meeting; tasks: Task[]; stats: { total: number; completed: number; open: number; overdue: number }; }

/** Follow-up health per meeting. Never framed as a per-person performance measure. */
export function MeetingFollowUp({ items }: { items: MeetingFollowUpItem[] }) {
  return <section className="min-w-0 space-y-4">
    <SectionHeader title="Meeting Follow-Up" description="How much of each meeting's action work is finished." />
    {!items.length
      ? <EmptyState title="No follow-up work yet" description="Confirmed meetings and their action items will appear here." />
      : <ul role="list" className="grid gap-4 lg:grid-cols-2">
        {items.map(({ meeting, stats }) => {
          const percent = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0;
          const health = stats.total === 0 ? "No action items"
            : stats.open === 0 ? "Fully actioned"
            : stats.overdue > 0 ? "Needs attention" : "In progress";
          return <li key={meeting.id}>
            <Card className="h-full p-[var(--card-padding)]">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 space-y-1">
                  <Link href={`/meetings/${meeting.id}/follow-up`} className="rounded-sm text-base font-medium text-foreground hover:text-primary">{meeting.title}</Link>
                  <p className="text-xs text-text-muted">{formatDate(meeting.date)} · {meeting.team}</p>
                </div>
                <Badge variant={stats.open === 0 && stats.total > 0 ? "success" : stats.overdue > 0 ? "danger" : stats.total === 0 ? "neutral" : "info"}>{health}</Badge>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-4">
                <div><dt className="text-xs text-text-muted">Action items</dt><dd className="tabular-nums text-foreground">{stats.total}</dd></div>
                <div><dt className="text-xs text-text-muted">Completed</dt><dd className="tabular-nums text-foreground">{stats.completed}</dd></div>
                <div><dt className="text-xs text-text-muted">Open</dt><dd className="tabular-nums text-foreground">{stats.open}</dd></div>
                <div><dt className="text-xs text-text-muted">Completion</dt><dd className="tabular-nums text-foreground">{percent}%</dd></div>
              </dl>
              <div className="mt-4">
                <div className="h-2 overflow-hidden rounded-pill bg-border">
                  <div className="h-full rounded-pill bg-primary transition-[width] duration-200" style={{ width: `${percent}%` }} />
                </div>
                <p className="sr-only">{stats.completed} of {stats.total} action items completed, {percent} percent.</p>
              </div>
              <Link href={`/meetings/${meeting.id}/follow-up`} className="mt-4 inline-flex items-center gap-1 rounded-sm text-sm font-medium">
                Open follow-up<ArrowUpRight aria-hidden="true" className="size-4" />
              </Link>
            </Card>
          </li>;
        })}
      </ul>}
  </section>;
}
export default MeetingFollowUp;