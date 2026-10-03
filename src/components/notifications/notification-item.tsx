"use client";

import { ArrowUpRight, Bell, CalendarDays, CalendarPlus, CheckCheck, CircleAlert, CircleCheck, MessageSquare, Sparkles, SquareCheckBig, Timer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DEMO_TODAY } from "@/data/mock/meetings";
import { formatTime } from "@/lib/meeting-format";
import type { DemoNotification, NotificationType } from "@/types/notification";

const icons: Record<NotificationType, typeof Bell> = {
  TASK_ASSIGNED: SquareCheckBig,
  TASK_DUE_SOON: Timer,
  TASK_OVERDUE: CircleAlert,
  TASK_COMPLETED: CircleCheck,
  MEETING_REMINDER: CalendarDays,
  MEETING_CREATED: CalendarPlus,
  MEETING_SUMMARY_READY: Sparkles,
  MEETING_CONFIRMED: CheckCheck,
  MENTION: MessageSquare,
  SYSTEM: Bell,
};

/** Timestamps are rendered relative to the fixed demo calendar so the demo stays stable. */
function relativeTime(timestamp: string) {
  const day = Math.round((Date.parse(DEMO_TODAY + "T12:00:00Z") - Date.parse(timestamp.slice(0, 10) + "T12:00:00Z")) / 86_400_000);
  if (day > 6) return timestamp.slice(0, 10);
  if (day === 1) return "Yesterday";
  if (day <= 0) return `Today, ${formatTime(timestamp.slice(11, 16))}`;
  return `${day} days ago`;
}

export interface NotificationItemProps {
  notification: DemoNotification;
  onToggleRead: (id: string, read: boolean) => void;
}

export function NotificationItem({ notification, onToggleRead }: NotificationItemProps) {
  const Icon = icons[notification.type];
  return <li className="min-w-0">
    <Card className={cn("p-[var(--card-padding)]", !notification.read && "border-primary/40 bg-surface-hover")}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <span aria-hidden="true" className={cn("flex size-9 shrink-0 items-center justify-center rounded-default",
            notification.read ? "bg-surface-soft text-text-muted" : "bg-ai-soft text-ai")}>
            <Icon className="size-4" />
          </span>
          <div className="min-w-0 flex-1 space-y-1">
            <p className="text-sm font-medium text-foreground">{notification.title}</p>
            <p className="text-sm leading-relaxed text-text-secondary">{notification.description}</p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Badge variant={notification.read ? "neutral" : "primary"}>{notification.read ? "Read" : "Unread"}</Badge>
              <span className="text-xs text-text-muted">{relativeTime(notification.timestamp)}</span>
              <span aria-hidden="true" className="text-xs text-text-muted">·</span>
              <span className="text-xs text-text-muted">{notification.category}</span>
            </div>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2 lg:justify-end">
          <Button variant="ghost" size="sm"
            onClick={() => onToggleRead(notification.id, !notification.read)}
            aria-label={`${notification.read ? "Mark unread" : "Mark read"}: ${notification.title}`}>
            {notification.read ? "Mark unread" : "Mark read"}
          </Button>
          {notification.href && <ButtonLink href={notification.href} variant="outline" size="sm"
            aria-label={`Open related item for ${notification.title}`}>
            Open<ArrowUpRight aria-hidden="true" />
          </ButtonLink>}
        </div>
      </div>
    </Card>
  </li>;
}
export default NotificationItem;