import Link from "next/link";
import type { Task,TaskStatus } from "@/types/task";
import type { Meeting } from "@/types/meeting";
import { getUser } from "@/services/team.service";
import { formatDate } from "@/lib/meeting-format";
import { taskHref } from "@/lib/task-utils";
import { Card } from "@/components/ui/card";
import { PriorityBadge } from "@/components/ui/priority-badge";
import { Button } from "@/components/ui/button";
import TaskStatusControl from "./task-status";
export function TaskSource({task,meetings}:{task:Task;meetings:Meeting[]}) {
  return task.meetingId?<Link href={`/meetings/${task.meetingId}`} className="break-words">{meetings.find(m=>m.id===task.meetingId)?.title??"Source meeting"}</Link>:<span className="text-text-muted">Manual / demo task</span>;
}
export default function TaskCard({task,meetings,onStatus}:{task:Task;meetings:Meeting[];onStatus?:(task:Task,status:TaskStatus)=>void}) {
  return <Card className="space-y-4 p-5"><h3 className="dovia-card-title"><Link href={taskHref(task.id)} className="text-foreground">{task.title}</Link></h3><p className="text-sm">From: <TaskSource task={task} meetings={meetings} /></p><p className="text-sm text-text-secondary">{getUser(task.assigneeId??"")?.name??"Unassigned"} · {task.dueDate?`Due ${formatDate(task.dueDate)}`:"No deadline"}</p><PriorityBadge priority={task.priority} /><TaskStatusControl task={task} onChange={onStatus} />{onStatus&&task.status!=="COMPLETED"&&<Button variant="outline" size="sm" onClick={()=>onStatus(task,"COMPLETED")}>Mark complete</Button>}</Card>;
}

