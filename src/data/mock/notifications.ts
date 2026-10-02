export interface NotificationPreview {
  id: string;
  kind: "assignment" | "meeting" | "overdue";
  title: string;
  description: string;
  timeLabel: string;
  href: string;
}

/** Static shell previews only; relative times and unread state are illustrative. */
export const notificationPreviews: readonly NotificationPreview[] = [
  { id: "assignment", kind: "assignment", title: "Task assigned to you", description: "Finish dashboard UI", timeLabel: "2m ago", href: "/tasks" },
  { id: "meeting", kind: "meeting", title: "Meeting starts soon", description: "Product Strategy Sync begins in 10 minutes", timeLabel: "8m ago", href: "/meetings" },
  { id: "overdue", kind: "overdue", title: "Task overdue", description: "Prepare launch brief", timeLabel: "1h ago", href: "/tasks" },
];
