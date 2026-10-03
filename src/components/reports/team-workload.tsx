import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import type { DemoUser } from "@/data/mock/users";

export interface WorkloadEntry { member: DemoUser; stats: { open: number; completed: number; overdue: number; total: number }; }

/**
 * Workload distribution only. There is deliberately no score, rank, or ordering by output.
 */
export function TeamWorkload({ entries }: { entries: WorkloadEntry[] }) {
  return <section className="min-w-0 space-y-4">
    <SectionHeader title="Team Workload" description="Where open commitments currently sit. This is a distribution view, not a performance ranking." />
    <Card className="divide-y divide-border px-[var(--card-padding)]">
      <div className="hidden grid-cols-[minmax(0,1fr)_6rem_6rem_6rem] gap-4 py-3 text-xs font-medium text-text-muted sm:grid">
        <span>Member</span><span className="text-right">Open</span><span className="text-right">Completed</span><span className="text-right">Overdue</span>
      </div>
      {entries.map(({ member, stats }) => <div key={member.id}
        className="grid grid-cols-2 gap-x-4 gap-y-2 py-4 sm:grid-cols-[minmax(0,1fr)_6rem_6rem_6rem] sm:items-center">
        <div className="col-span-2 flex min-w-0 items-center gap-3 sm:col-span-1">
          <Avatar name={member.name} size="sm" />
          <div className="min-w-0">
            <Link href={`/team/${member.id}`} className="rounded-sm font-medium text-foreground hover:text-primary">{member.name}</Link>
            <p className="truncate text-xs text-text-muted">{member.department}</p>
          </div>
        </div>
        <p className="text-sm text-text-secondary sm:text-right"><span className="text-xs text-text-muted sm:hidden">Open </span><span className="tabular-nums">{stats.open}</span></p>
        <p className="text-sm text-text-secondary sm:text-right"><span className="text-xs text-text-muted sm:hidden">Completed </span><span className="tabular-nums">{stats.completed}</span></p>
        <p className="text-sm sm:text-right">
          <span className="text-xs text-text-muted sm:hidden">Overdue </span>
          <span className={stats.overdue > 0 ? "tabular-nums font-medium text-danger-foreground" : "tabular-nums text-text-secondary"}>
            {stats.overdue}{stats.overdue > 0 && <span className="sr-only"> overdue</span>}
          </span>
        </p>
      </div>)}
    </Card>
  </section>;
}
export default TeamWorkload;