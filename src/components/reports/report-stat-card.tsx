import type { ComponentPropsWithRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ReportStatCardProps extends Omit<ComponentPropsWithRef<"div">, "title"> {
  label: string;
  value: string | number;
  icon?: ReactNode;
  hint?: string;
  tone?: "default" | "success" | "warning" | "danger" | "info";
}
const toneStyles = {
  default: "bg-surface-soft text-primary",
  success: "bg-success-soft text-success-foreground",
  warning: "bg-warning-soft text-warning-foreground",
  danger: "bg-danger-soft text-danger-foreground",
  info: "bg-info-soft text-info-foreground",
} as const;

/** Report totals always come from a service; this card only presents them. */
export function ReportStatCard({ label, value, icon, hint, tone = "default", className, ...props }: ReportStatCardProps) {
  return <div {...props} className={cn("min-w-0 rounded-lg border border-border bg-surface p-5", className)}>
    <div className="flex items-start gap-3">
      {icon && <span aria-hidden="true" className={cn("flex size-9 shrink-0 items-center justify-center rounded-default [&_svg]:size-4", toneStyles[tone])}>{icon}</span>}
      <div className="min-w-0 flex-1 space-y-1">
        <p className="text-sm text-text-secondary">{label}</p>
        <p className="text-3xl font-semibold text-foreground">{value}</p>
      </div>
    </div>
    {hint && <p className="mt-3 text-xs text-text-muted">{hint}</p>}
  </div>;
}
export default ReportStatCard;