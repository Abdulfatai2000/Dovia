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
  blockedReason?: string;
  createdAt?: string;
  updatedAt?: string;
  completedAt?: string;
}
export type TaskInput = Pick<Task, "title" | "description" | "meetingId" | "assigneeId" | "dueDate" | "priority" | "status" | "blockedReason">;
export type TaskChanges = Partial<Omit<TaskInput, "meetingId">>;
export interface TaskActivity { id: string; taskId: string; actorId: string; message: string; timestamp: string; }
