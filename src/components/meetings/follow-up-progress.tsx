"use client";
import { useMeetings } from "@/hooks/use-meetings";
import { useTasks } from "@/hooks/use-tasks";
import { summarizeTasks,taskStatuses,taskStatusLabel } from "@/lib/task-utils";
import { PageHeader } from "@/components/ui/page-header";
import { SectionHeader } from "@/components/ui/section-header";
import { ButtonLink } from "@/components/ui/button-link";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LoadingState } from "@/components/ui/loading-state";
import { EmptyState } from "@/components/ui/empty-state";
import { MeetingNotFound } from "./meeting-state";
import TaskTable from "@/components/tasks/task-table";
import TaskActivityFeed from "@/components/tasks/task-activity-feed";
import { useTaskActions } from "@/components/tasks/use-task-actions";
const tones={COMPLETED:"bg-success",IN_PROGRESS:"bg-primary",NOT_STARTED:"bg-border-strong",BLOCKED:"bg-warning",OVERDUE:"bg-danger"};
export default function FollowUpProgress({meetingId}:{meetingId:string}) {
  const meetingState=useMeetings();const taskState=useTasks();const actions=useTaskActions();
  if(meetingState.loading||taskState.loading)return <LoadingState label="Loading follow-up progress…" />;
  const meeting=meetingState.meetings.find(m=>m.id===meetingId);
  if(meetingState.error||taskState.error||!meeting)return <MeetingNotFound error={meetingState.error||taskState.error} />;
  const tasks=taskState.tasks.filter(task=>task.meetingId===meetingId);const stats=summarizeTasks(tasks);
  return <div className="space-y-6"><PageHeader eyebrow={meeting.title} title="Meeting Follow-up" description="Track progress on action items created from this meeting." breadcrumbs={<ButtonLink href={`/meetings/${meetingId}`} variant="ghost" size="sm">← Back to Meeting</ButtonLink>} actions={<ButtonLink href={`/meetings/${meetingId}`} variant="outline">View Meeting Summary</ButtonLink>} /><p className="text-xs text-text-muted">Demo data · Past-due calculations use October 5, 2026.</p>
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{[{label:"Total Tasks",value:stats.total},{label:"Completed",value:stats.completed},{label:"In Progress",value:stats.inProgress},{label:"Overdue",value:stats.overdue}].map(item=><Card key={item.label} className="space-y-2 p-5"><p className="text-sm text-text-secondary">{item.label}</p><p className="text-3xl font-semibold">{item.value}</p></Card>)}</div>
    <Card className="space-y-5 p-5"><SectionHeader title="Completion" description={`${stats.completed} of ${stats.total} tasks completed`} /><Progress value={stats.completed} max={stats.total||1} label="Meeting task completion" />
      <h3 className="text-sm font-semibold">Status distribution</h3><div aria-hidden="true" className="flex h-3 overflow-hidden rounded-pill bg-surface-soft">{taskStatuses.map(status=><span key={status} className={tones[status]} style={{width:`${tasks.length?tasks.filter(t=>t.status===status).length/tasks.length*100:0}%`}} />)}</div>
      <ul className="flex flex-wrap gap-4 text-xs text-text-secondary">{taskStatuses.map(status=><li key={status} className="flex items-center gap-2"><span aria-hidden="true" className={`size-2 rounded-pill ${tones[status]}`} />{taskStatusLabel(status)}: {tasks.filter(t=>t.status===status).length}</li>)}</ul><p className="text-xs text-text-muted">The overdue total also includes unfinished tasks past their deadline, even when their status is In Progress or Blocked.</p>
    </Card>
    <section className="space-y-4"><SectionHeader title="Meeting action items" />{tasks.length?<TaskTable tasks={tasks} meetings={meetingState.meetings} onStatus={actions.onStatus} />:<EmptyState title="No follow-up tasks yet." description="Confirmed action items from this meeting will appear here." />}</section>
    <section className="space-y-4"><SectionHeader title="Follow-up activity" /><TaskActivityFeed tasks={tasks} activity={taskState.activity} /></section>{actions.feedback}
  </div>;
}
