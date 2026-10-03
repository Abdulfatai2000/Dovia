import Link from "next/link";
import type { Task,TaskActivity } from "@/types/task";
import { getUser } from "@/data/mock/users";
import { taskHref } from "@/lib/task-utils";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
export default function TaskActivityFeed({activity,tasks}:{activity:TaskActivity[];tasks:Task[]}) {
  const visible=activity.filter(item=>tasks.some(task=>task.id===item.taskId)).slice(0,12);
  return <Card className="p-5">{visible.length?<ul className="divide-y divide-border">{visible.map(item=><li key={item.id} className="flex gap-3 py-4 first:pt-0 last:pb-0"><Avatar name={getUser(item.actorId)?.name??"Demo member"} size="sm" /><div className="min-w-0 space-y-1 text-sm"><p className="font-medium">{getUser(item.actorId)?.name} · {item.message}</p><Link href={taskHref(item.taskId)}>{tasks.find(task=>task.id===item.taskId)?.title}</Link><p className="text-xs text-text-muted"><time dateTime={item.timestamp}>{new Date(item.timestamp).toLocaleString("en-GB",{timeZone:"UTC"})} UTC</time> · Demo activity</p></div></li>)}</ul>:<p className="text-sm text-text-muted">No recorded changes yet. Task updates in this browser will appear here.</p>}</Card>;
}
