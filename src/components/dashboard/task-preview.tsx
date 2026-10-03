import Link from "next/link";
import type { Task } from "@/types/task";
import { Card } from "@/components/ui/card";
import { PriorityBadge } from "@/components/ui/priority-badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/meeting-format";
export default function TaskPreview({ tasks, loading = false }: { tasks: Task[]; loading?: boolean }) {
  if (loading) return <Skeleton className="h-72" />;
  if (!tasks.length) return <EmptyState title="You're all caught up" description="Your follow-up tasks will appear here." />;
  return <Card><ul className="divide-y divide-border">{tasks.map(task => <li key={task.id} className="space-y-3 p-5">
    <Link href={`/tasks/${task.id}`} className="block font-medium text-foreground">{task.title}</Link>
    <p className="text-xs text-text-muted">Due {task.dueDate ? formatDate(task.dueDate) : "date not set"}</p>
    <div className="flex flex-wrap gap-2"><PriorityBadge priority={task.priority} /><StatusBadge status={task.status} /></div>
  </li>)}</ul></Card>;
}
