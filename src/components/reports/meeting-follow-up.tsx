import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate, formatTime } from "@/lib/meeting-format";
import type { Meeting } from "@/types/meeting";
import type { Task } from "@/types/task";

export interface MeetingFollowUpItem { meeting: Meeting; tasks: Task[]; stats: { total: number; completed: number; open: number; overdue: number }; }

/** Follow-up health per meeting. Never framed as a per-person performance measure. */
export function MeetingFollowUp({ items }: { items: MeetingFollowUpItem[] }) {
  return <section className="flex h-full min-w-0 flex-col">
    <Card className="flex h-full flex-col p-[var(--card-padding)]">
      <h2 className="dovia-card-title">Meeting Follow-Up</h2>
      <p className="mt-1 mb-4 text-sm text-text-secondary">How much of each meeting&apos;s action work is finished.</p>
      {!items.length
        ? <EmptyState title="No follow-up work yet" description="Confirmed meetings and their action items will appear here." className="border-0 bg-surface-soft py-8" />
        : <ul role="list" className="min-w-0 space-y-4">
          {items.map(({ meeting, stats }) => {
            const percent = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0;
            const health = stats.total === 0 ? "No action items"
              : stats.open === 0 ? "Fully actioned"
              : stats.overdue > 0 ? "Needs attention" : "In progress";
            return <li key={meeting.id} className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <Link href={`/meetings/${meeting.id}/follow-up`} className="rounded-sm text-sm font-medium text-foreground hover:text-primary">{meeting.title}</Link>
                  <p className="text-xs text-text-muted">{formatDate(meeting.date)} · {formatTime(meeting.startTime)}</p>
                </div>
                <Badge variant={stats.open === 0 && stats.total > 0 ? "success" : stats.overdue > 0 ? "danger" : stats.total === 0 ? "neutral" : "info"}>{health}</Badge>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-pill bg-border">
                  <div className="h-full rounded-pill bg-primary transition-[width] duration-200" style={{ width: `${percent}%` }} />
                </div>
                <span className="w-20 shrink-0 text-right text-xs text-text-secondary">
                  <span className="font-medium text-foreground">{stats.completed} / {stats.total}</span> · {percent}%
                </span>
              </div>
              <span className="sr-only">{stats.completed} of {stats.total} action items completed, {percent} percent.</span>
              <Link href={`/meetings/${meeting.id}/follow-up`} className="inline-flex items-center gap-1 rounded-sm text-xs font-medium">
                Open follow-up<ArrowUpRight aria-hidden="true" className="size-3.5" />
              </Link>
            </li>;
          })}
        </ul>}
    </Card>
  </section>;
}
export default MeetingFollowUp;