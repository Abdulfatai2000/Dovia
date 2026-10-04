import { CornerDownRight } from "lucide-react";
import type { Meeting } from "@/types/meeting";
import { getUser } from "@/services/team.service";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { SectionHeader } from "@/components/ui/section-header";
import { formatDate } from "@/lib/meeting-format";
export default function MeetingCarryOver({ meeting }: { meeting: Meeting }) {
  const tasks = meeting.carryOver.filter(item => item.kind === "Task").length;
  const decisions = meeting.carryOver.filter(item => item.kind === "Decision").length;
  return <Card className="space-y-5 border-primary/20 p-5"><SectionHeader title="Carry-over from Previous Meeting" description={meeting.carryOver.length ? `${tasks} unfinished tasks and ${decisions} unresolved decision from ${meeting.previousMeetingTitle ?? "the previous meeting"}` : "A fresh start — no carry-over items for this meeting."} />
    {meeting.carryOver.length > 0 && <ul className="divide-y divide-border">{meeting.carryOver.map(item => <li key={item.id} className="flex items-start gap-3 py-4 first:pt-0 last:pb-0"><CornerDownRight aria-hidden="true" className="mt-1 size-4 shrink-0 text-primary" /><div className="min-w-0 flex-1 space-y-2"><p className="break-words text-sm font-medium">{item.title}</p><div className="flex flex-wrap gap-2"><Badge variant="neutral">{item.kind}</Badge>{item.status === "NEEDS_DECISION" ? <Badge variant="warning">Needs Decision</Badge> : <StatusBadge status={item.status} />}</div><p className="text-xs text-text-muted">{item.ownerId && getUser(item.ownerId)?.name}{item.dueDate && ` · Due ${formatDate(item.dueDate)}`}</p></div></li>)}</ul>}
  </Card>;
}

