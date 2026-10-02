import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant = "default" | "primary" | "success" | "warning" | "danger" | "info" | "neutral" | "ai";
export interface BadgeProps extends ComponentPropsWithRef<"span"> { variant?: BadgeVariant; }
const variants: Record<BadgeVariant, string> = {
  default: "bg-surface-soft text-text-secondary",
  primary: "bg-surface-hover text-primary",
  success: "bg-success-soft text-success-foreground",
  warning: "bg-warning-soft text-warning-foreground",
  danger: "bg-danger-soft text-danger-foreground",
  info: "bg-info-soft text-info-foreground",
  neutral: "bg-surface-soft text-text-muted",
  ai: "bg-ai-soft text-ai",
};
export function Badge({ variant = "default", className, ...props }: BadgeProps) {
  return <span {...props} className={cn("inline-flex max-w-full items-center gap-1.5 rounded-pill px-2.5 py-1 text-xs font-medium leading-5 [&_svg]:size-3.5 [&_svg]:shrink-0", variants[variant], className)} />;
}
export default Badge;
