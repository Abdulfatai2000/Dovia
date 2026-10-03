"use client";
import type { Task, TaskStatus } from "@/types/task";
import { Select } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { isTaskOverdue, taskStatuses, taskStatusLabel } from "@/lib/task-utils";
export default function TaskStatusControl({task,onChange}:{task:Task;onChange?:(task:Task,status:TaskStatus)=>void}) {
  return <div className="min-w-0 space-y-2"><div className="flex flex-wrap gap-2"><StatusBadge status={task.status} />{isTaskOverdue(task)&&task.status!=="OVERDUE"&&<Badge variant="danger">Past due</Badge>}</div>
    {onChange&&<Select label={`Change status: ${task.title}`} hideLabel value={task.status} onChange={e=>onChange(task,e.target.value as TaskStatus)} options={taskStatuses.map(value=>({value,label:taskStatusLabel(value)}))} />}
  </div>;
}
