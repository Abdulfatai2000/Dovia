import type { Task } from "@/types/task";
export const tasks: Task[] = [
  { id: "task-product-requirements", title: "Finalize product requirements", meetingId: "meeting-product-strategy", assigneeId: "user-abdulfatai", dueDate: "2026-10-05", priority: "HIGH", status: "IN_PROGRESS" },
  { id: "task-payments", title: "Review payment API documentation", assigneeId: "user-abdulfatai", dueDate: "2026-10-06", priority: "MEDIUM", status: "NOT_STARTED" },
  { id: "task-campaign-assets", title: "Prepare campaign assets", assigneeId: "user-abdulfatai", dueDate: "2026-10-02", priority: "HIGH", status: "OVERDUE" },
  { id: "task-mobile", title: "Update mobile responsiveness", assigneeId: "user-abdulfatai", dueDate: "2026-10-08", priority: "LOW", status: "IN_PROGRESS" },
  { id: "task-research", title: "Research competitor analysis", assigneeId: "user-abdulfatai", dueDate: "2026-10-05", priority: "MEDIUM", status: "COMPLETED" },
];
