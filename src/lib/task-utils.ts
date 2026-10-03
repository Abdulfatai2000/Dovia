import { DEMO_TODAY } from "@/data/mock/meetings";
import type { Task, TaskStatus, TaskPriority } from "@/types/task";
export const taskStatuses: TaskStatus[] = ["NOT_STARTED", "IN_PROGRESS", "BLOCKED", "COMPLETED", "OVERDUE"];
export const taskPriorities: TaskPriority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];
export const CURRENT_USER_ID = "user-abdulfatai";
export const isTaskOverdue = (task: Task) => task.status !== "COMPLETED" && (task.status === "OVERDUE" || Boolean(task.dueDate && task.dueDate < DEMO_TODAY));
export const taskStatusLabel = (status: string) => status.toLowerCase().split("_").map(word => word[0].toUpperCase()+word.slice(1)).join(" ");
export const taskHref = (id: string) => `/tasks/${encodeURIComponent(id)}`;
export function summarizeTasks(tasks: Task[]) {
  return { total:tasks.length, completed:tasks.filter(t => t.status === "COMPLETED").length,
    open:tasks.filter(t => t.status !== "COMPLETED").length, inProgress:tasks.filter(t => t.status === "IN_PROGRESS").length,
    overdue:tasks.filter(isTaskOverdue).length, blocked:tasks.filter(t => t.status === "BLOCKED").length };
}
export function dateKey(date: Date) { return date.toISOString().slice(0,10); }
export function shiftDay(day: string, count: number) { const date = new Date(day+"T12:00:00Z"); date.setUTCDate(date.getUTCDate()+count); return dateKey(date); }
export function weekStart(day: string) { const date = new Date(day+"T12:00:00Z"); return shiftDay(day,-((date.getUTCDay()+6)%7)); }
export function inDemoWeek(day: string) { const start=weekStart(DEMO_TODAY); return day >= start && day <= shiftDay(start,6); }
