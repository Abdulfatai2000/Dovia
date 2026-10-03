"use client";
import Link from "next/link";
import { getTeamMember } from "@/services/team.service";
import { useTasks } from "@/hooks/use-tasks";
import { useMeetings } from "@/hooks/use-meetings";
import { DEMO_TODAY } from "@/data/mock/meetings";
import { activities } from "@/data/mock/activities";
import { summarizeTasks } from "@/lib/task-utils";
import { formatDate,formatTime } from "@/lib/meeting-format";
import { PageHeader } from "@/components/ui/page-header";
import { SectionHeader } from "@/components/ui/section-header";
import { ButtonLink } from "@/components/ui/button-link";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import ActivityFeed from "@/components/dashboard/activity-feed";
import TaskTable from "@/components/tasks/task-table";
import TaskActivityFeed from "@/components/tasks/task-activity-feed";
import { useTaskActions } from "@/components/tasks/use-task-actions";
export default function MemberDetail({memberId}:{memberId:string}) {
  const taskState=useTasks();const meetingState=useMeetings();const member=getTeamMember(memberId);const actions=useTaskActions();
  if(taskState.loading||meetingState.loading)return <LoadingState label="Loading team member…" />;
  if(!member||taskState.error||meetingState.error)return <div className="space-y-6"><PageHeader title="Team member not found" /><ErrorState title="Team member not found" description={taskState.error||meetingState.error||"This member could not be found in the demo workspace."} /><ButtonLink href="/team">Back to Team</ButtonLink></div>;
  const assigned=taskState.tasks.filter(t=>t.assigneeId===member.id);const stats=summarizeTasks(assigned);
  const meetings=meetingState.meetings.filter(m=>m.participants.some(p=>p.userId===member.id));
  const upcoming=meetings.filter(m=>m.date>=DEMO_TODAY&&["SCHEDULED","IN_PROGRESS"].includes(m.status));
  return <div className="space-y-6"><PageHeader title={member.name} eyebrow="Team member" description={`${member.role} · ${member.department}`} breadcrumbs={<ButtonLink href="/team" variant="ghost" size="sm">← Back to Team</ButtonLink>} /><Card className="flex flex-wrap items-center gap-4 p-5"><Avatar name={member.name} size="lg" /><div className="min-w-0"><p className="break-all text-sm">{member.email}</p><p className="mt-1 text-xs text-text-muted">Demo contact · Status is illustrative, not live presence.</p></div><Badge variant={member.status==="Active"?"success":"neutral"}>{member.status}</Badge></Card>
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">{[{label:"Open Tasks",value:stats.open},{label:"Completed Tasks",value:stats.completed},{label:"Upcoming Meetings",value:upcoming.length},{label:"Overdue Tasks",value:stats.overdue}].map(item=><Card key={item.label} className="space-y-2 p-5"><p className="text-sm text-text-secondary">{item.label}</p><p className="text-3xl font-semibold">{item.value}</p></Card>)}</div>
    <section className="space-y-4"><SectionHeader title="Assigned tasks" /><TaskTable tasks={assigned} meetings={meetingState.meetings} onStatus={actions.onStatus} /></section>
    <div className="grid items-start gap-6 xl:grid-cols-2"><section className="min-w-0 space-y-4"><SectionHeader title="Member meetings" description="Upcoming and recent meetings from the shared demo calendar." />{meetings.length?<Card className="divide-y divide-border px-5">{[...meetings].sort((a,b)=>b.date.localeCompare(a.date)).map(m=><div key={m.id} className="space-y-1 py-4"><Link href={`/meetings/${m.id}`} className="text-sm font-medium">{m.title}</Link><p className="text-xs text-text-muted">{formatDate(m.date)} · {formatTime(m.startTime)} · {m.platform}</p></div>)}</Card>:<EmptyState title="No meetings yet" description="Meetings with this participant will appear here." />}</section>
    <section className="min-w-0 space-y-4"><SectionHeader title="Member activity" /><TaskActivityFeed activity={taskState.activity.filter(a=>a.actorId===member.id)} tasks={taskState.tasks} /><ActivityFeed activities={activities.filter(a=>a.actorId===member.id)} /></section></div>{actions.feedback}
  </div>;
}
