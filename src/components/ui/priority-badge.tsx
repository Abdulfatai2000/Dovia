import type { TaskPriority } from "@/types";
import { cn } from "@/lib/utils";
import { Badge, type BadgeProps, type BadgeVariant } from "./badge";

export const priorityPresentation: Record<TaskPriority, { label: string; variant: BadgeVariant; dot: string }> = {
  LOW: { label: "Low", variant: "success", dot: "bg-priority-low" },
  MEDIUM: { label: "Medium", variant: "warning", dot: "bg-priority-medium" },
  HIGH: { label: "High", variant: "danger", dot: "bg-priority-high" },
  URGENT: { label: "Urgent", variant: "danger", dot: "bg-priority-urgent" },
};
export interface PriorityBadgeProps extends Omit<BadgeProps, "children" | "variant"> { priority: TaskPriority; }
export function PriorityBadge({ priority, ...props }: PriorityBadgeProps) {
  const presentation = priorityPresentation[priority];
  return <Badge {...props} variant={presentation.variant}><span aria-hidden="true" className={cn("size-1.5 shrink-0 rounded-pill", presentation.dot)} />{presentation.label}</Badge>;
}
