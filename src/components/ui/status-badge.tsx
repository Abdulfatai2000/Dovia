import type { MeetingStatus, TaskStatus } from "@/types";
import { Badge, type BadgeProps, type BadgeVariant } from "./badge";

type Status = MeetingStatus | TaskStatus;
export const statusPresentation: Record<Status, { label: string; variant: BadgeVariant }> = {
  DRAFT: { label: "Draft", variant: "neutral" },
  SCHEDULED: { label: "Scheduled", variant: "info" },
  IN_PROGRESS: { label: "In Progress", variant: "primary" },
  PROCESSING: { label: "Processing", variant: "ai" },
  REVIEW: { label: "Review", variant: "warning" },
  COMPLETED: { label: "Completed", variant: "success" },
  CANCELLED: { label: "Cancelled", variant: "neutral" },
  NOT_STARTED: { label: "Not Started", variant: "neutral" },
  BLOCKED: { label: "Blocked", variant: "danger" },
  OVERDUE: { label: "Overdue", variant: "danger" },
};
export interface StatusBadgeProps extends Omit<BadgeProps, "children" | "variant"> { status: Status; }
export function StatusBadge({ status, ...props }: StatusBadgeProps) {
  const presentation = statusPresentation[status];
  return <Badge {...props} variant={presentation.variant}>{presentation.label}</Badge>;
}
