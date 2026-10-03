import Link from "next/link";
import type { Task, TaskStatus } from "@/types/task";
import type { Meeting } from "@/types/meeting";
import { getUser } from "@/data/mock/users";
import { formatDate } from "@/lib/meeting-format";
import { taskHref } from "@/lib/task-utils";
import { PriorityBadge } from "@/components/ui/priority-badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Table,TableBody,TableCell,TableHead,TableHeader,TableRow,TableCaption } from "@/components/ui/table";
import TaskCard,{TaskSource} from "./task-card";
import TaskStatusControl from "./task-status";
export default function TaskTable({tasks,meetings,onStatus}:{tasks:Task[];meetings:Meeting[];onStatus?:(task:Task,status:TaskStatus)=>void}) {
  if(!tasks.length)return <EmptyState title="No tasks to show" description="Tasks assigned from meetings or added manually will appear here." />;
  return <><div className="grid gap-4 lg:hidden sm:grid-cols-2">{tasks.map(task=><TaskCard key={task.id} task={task} meetings={meetings} onStatus={onStatus} />)}</div>
    <div className="hidden min-w-0 lg:block"><Table containerLabel="Tasks" className="min-w-[960px]"><TableCaption>Demo tasks with links back to their source meetings.</TableCaption><TableHeader><TableRow>{["Task","Source Meeting","Owner","Due Date","Priority","Status","Actions"].map(label=><TableHead key={label}>{label}</TableHead>)}</TableRow></TableHeader><TableBody>{tasks.map(task=><TableRow key={task.id}><TableCell className="max-w-64 break-words"><Link href={taskHref(task.id)} className="font-medium">{task.title}</Link></TableCell><TableCell className="max-w-48"><TaskSource task={task} meetings={meetings} /></TableCell><TableCell>{getUser(task.assigneeId??"")?.name??"Unassigned"}</TableCell><TableCell className="whitespace-nowrap">{task.dueDate?formatDate(task.dueDate):"No deadline"}</TableCell><TableCell><PriorityBadge priority={task.priority} /></TableCell><TableCell className="min-w-44"><TaskStatusControl task={task} onChange={onStatus} /></TableCell><TableCell>{onStatus&&task.status!=="COMPLETED"?<Button variant="ghost" size="sm" onClick={()=>onStatus(task,"COMPLETED")}>Complete<span className="sr-only"> {task.title}</span></Button>:<Link href={taskHref(task.id)}>Details<span className="sr-only"> for {task.title}</span></Link>}</TableCell></TableRow>)}</TableBody></Table></div></>;
}
