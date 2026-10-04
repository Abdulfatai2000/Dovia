import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant = "default" | "primary" | "success" | "warning" | "danger" | "info" | "neutral" | "ai";
export interface BadgeProps extends ComponentPropsWithRef<"span"> { variant?: BadgeVariant; }
const variants: Record<BadgeVariant, string> = {
  default: "bg-surface-soft text-text-secondary ring-1 ring-border ring-inset",
  primary: "bg-blue-soft text-blue-foreground ring-1 ring-blue/20 ring-inset",
  success: "bg-emerald-soft text-emerald-foreground ring-1 ring-emerald/25 ring-inset",
  warning: "bg-orange-soft text-orange-foreground ring-1 ring-orange/25 ring-inset",
  danger: "bg-red-soft text-red-foreground ring-1 ring-red/25 ring-inset",
  info: "bg-cyan-soft text-cyan-foreground ring-1 ring-cyan/25 ring-inset",
  neutral: "bg-surface-soft text-text-muted ring-1 ring-border ring-inset",
  ai: "bg-ai-soft text-ai-foreground ring-1 ring-ai/25 ring-inset",
};
export function Badge({ variant = "default", className, ...props }: BadgeProps) {
  return <span {...props} className={cn("inline-flex max-w-full items-center gap-1.5 rounded-pill px-2.5 py-1 text-xs font-medium tracking-wide whitespace-nowrap transition-colors duration-200 [&_svg]:size-3.5 [&_svg]:shrink-0", variants[variant], className)} />;
}
export default Badge;