"use client";
import { useState } from "react";
import { useTasks } from "@/hooks/use-tasks";
import { useMeetings } from "@/hooks/use-meetings";
import { updateTask } from "@/services/task.service";
import { getUser } from "@/services/team.service";
import { formatDate } from "@/lib/meeting-format";
import { PageHeader } from "@/components/ui/page-header";
import { SectionHeader } from "@/components/ui/section-header";
import { ButtonLink } from "@/components/ui/button-link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PriorityBadge } from "@/components/ui/priority-badge";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { Toast } from "@/components/ui/toast";
import TaskForm from "./task-form";
import TaskActivityFeed from "./task-activity-feed";
import TaskStatusControl from "./task-status";
import { TaskSource } from "./task-card";
import { useTaskActions } from "./use-task-actions";
export default function TaskDetail({taskId}:{taskId:string}) {
  const state=useTasks();const meetings=useMeetings();const actions=useTaskActions();const [saved,setSaved]=useState(false);
  if(state.loading||meetings.loading)return <LoadingState label="Loading task…" />;
  const task=state.tasks.find(task=>task.id===taskId);
  if(state.error||meetings.error||!task)return <div className="space-y-6"><PageHeader title="Task not found" /><ErrorState title={state.error||meetings.error?"Unable to load task":"Task not found"} description={state.error||meetings.error||"This task could not be found in the demo workspace."} /><ButtonLink href="/tasks">Back to My Tasks</ButtonLink></div>;
  return <div className="space-y-6"><PageHeader title={task.title} eyebrow="Task detail" breadcrumbs={<ButtonLink href="/tasks" variant="ghost" size="sm">← Back to My Tasks</ButtonLink>} actions={task.status!=="COMPLETED"&&<Button onClick={()=>actions.onStatus(task,"COMPLETED")}>Mark complete</Button>} />
    <Card className="space-y-4 p-5"><p className="text-sm font-medium">{task.meetingId?"Created from: ":"Source: "}<TaskSource task={task} meetings={meetings.meetings} /></p><div className="flex flex-wrap items-start gap-4"><TaskStatusControl task={task} /><PriorityBadge priority={task.priority} /><span className="text-sm text-text-secondary">{getUser(task.assigneeId??"")?.name??"Unassigned"} · {task.dueDate?`Due ${formatDate(task.dueDate)}`:"No deadline"}</span></div>{task.description&&<p className="whitespace-pre-wrap break-words text-sm text-text-secondary">{task.description}</p>}{task.blockedReason&&task.status==="BLOCKED"&&<p className="rounded-md bg-warning-soft p-3 text-sm text-warning-foreground">Blocked: {task.blockedReason}</p>}
      {(task.createdAt||task.updatedAt||task.completedAt)&&<dl className="flex flex-wrap gap-4 text-xs text-text-muted">{([['Created',task.createdAt],['Updated',task.updatedAt],['Completed',task.completedAt]] as const).map(([label,value])=>value&&<div key={label}><dt>{label}</dt><dd>{new Date(value).toLocaleString("en-GB",{timeZone:"UTC"})} UTC</dd></div>)}</dl>}
    </Card><div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]"><Card className="space-y-5 p-5"><SectionHeader title="Edit task" /><TaskForm key={`${task.id}:${task.updatedAt??"initial"}`} task={task} meetings={meetings.meetings} onSave={input=>{const {meetingId:source,...changes}=input;void source;updateTask(task.id,changes);setSaved(true);}} /></Card><section className="min-w-0 space-y-4"><SectionHeader title="Task activity" /><p className="text-sm text-text-muted">{task.id.startsWith("confirmed:")?"Created from a confirmed meeting outcome.":task.meetingId?"Demo task linked to its source meeting.":"Manual / seeded demo task."}</p><TaskActivityFeed activity={state.activity} tasks={[task]} /><p className="text-xs text-text-muted">Activity records frontend changes in this browser. Comments are not connected yet.</p></section></div>
    {saved&&<div className="fixed inset-x-4 bottom-4 z-[var(--z-toast)] sm:left-auto"><Toast variant="success" title="Task updated." description="Saved in this browser only." onDismiss={()=>setSaved(false)} /></div>}{actions.feedback}
  </div>;
}



