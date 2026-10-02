export type TaskStatus = "NOT_STARTED" | "IN_PROGRESS" | "BLOCKED" | "COMPLETED" | "OVERDUE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface Task {
  id: string;
  title: string;
  description?: string;
  meetingId?: string;
  assigneeId?: string;
  dueDate?: string;
  priority: TaskPriority;
  status: TaskStatus;
}
