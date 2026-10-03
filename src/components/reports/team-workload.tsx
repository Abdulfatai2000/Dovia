import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import type { DemoUser } from "@/data/mock/users";

export interface WorkloadEntry { member: DemoUser; stats: { open: number; completed: number; overdue: number; total: number }; }

/**
 * Workload distribution only. There is deliberately no score, rank, or ordering by output.
 */
export function TeamWorkload({ entries }: { entries: WorkloadEntry[] }) {
  return <section className="flex h-full min-w-0 flex-col">
    <Card className="flex h-full flex-col p-[var(--card-padding)]">
      <h2 className="dovia-card-title">Team Workload</h2>
      <p className="mt-1 mb-4 text-sm text-text-secondary">Where open commitments currently sit. This is a distribution view, not a performance ranking.</p>
      <ul role="list" className="min-w-0 space-y-4">
        {entries.map(({ member, stats }) => {
          const percent = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0;
          return <li key={member.id} className="min-w-0">
            <div className="flex items-center gap-3">
              <Avatar name={member.name} size="sm" />
              <div className="min-w-0 flex-1">
                <Link href={`/team/${member.id}`} className="block truncate rounded-sm text-sm font-medium text-foreground hover:text-primary">{member.name}</Link>
                <p className="text-xs text-text-muted">{stats.open} open{stats.overdue > 0 ? ` · ${stats.overdue} overdue` : ""}</p>
              </div>
              <span className="shrink-0 text-xs tabular-nums text-text-secondary">
                <span className="font-medium text-foreground">{stats.completed} / {stats.total}</span>
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-pill bg-border">
              <div className="h-full rounded-pill bg-primary transition-[width] duration-200" style={{ width: `${percent}%` }} />
            </div>
            <span className="sr-only">{member.name}: {stats.completed} of {stats.total} tasks completed, {percent} percent.</span>
          </li>;
        })}
      </ul>
    </Card>
  </section>;
}
export default TeamWorkload;