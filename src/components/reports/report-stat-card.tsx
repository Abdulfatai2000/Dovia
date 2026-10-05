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
  default: "bg-blue-soft text-blue-foreground",
  success: "bg-emerald-soft text-emerald-foreground",
  warning: "bg-orange-soft text-orange-foreground",
  danger: "bg-red-soft text-red-foreground",
  info: "bg-violet-soft text-violet-foreground",
} as const;
const toneWashes = {
  default: "from-blue/12",
  success: "from-emerald/12",
  warning: "from-orange/14",
  danger: "from-red/12",
  info: "from-violet/12",
} as const;

/** Report totals always come from a service; this card only presents them. */
export function ReportStatCard({ label, value, icon, hint, tone = "default", className, ...props }: ReportStatCardProps) {
  return <div {...props} className={cn("dovia-lift relative min-w-0 overflow-hidden rounded-lg border border-border bg-surface bg-gradient-to-br to-transparent p-5", toneWashes[tone], className)}>
    <div className="relative flex items-start gap-3">
      {icon && <span aria-hidden="true" className={cn("flex size-9 shrink-0 items-center justify-center rounded-default [&_svg]:size-4", toneStyles[tone])}>{icon}</span>}
      <div className="min-w-0 flex-1 space-y-1">
        <p className="text-sm text-text-secondary">{label}</p>
        <p className="dovia-pop text-3xl font-semibold text-foreground">{value}</p>
      </div>
    </div>
    {hint && <p className="relative mt-3 text-xs text-text-muted">{hint}</p>}
  </div>;
}
export default ReportStatCard;