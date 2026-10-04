import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/utils";

export interface ProgressProps extends Omit<ComponentPropsWithRef<"div">, "children"> {
  value: number;
  max?: number;
  label?: string;
  /** Solid accent instead of the default emerald→cyan fill. */
  tone?: "accent" | "success";
}
export function Progress({ value, max = 100, label = "Progress", tone = "success", className, ...props }: ProgressProps) {
  const safeMax = Number.isFinite(max) && max > 0 ? max : 100;
  const safeValue = Number.isFinite(value) ? Math.min(safeMax, Math.max(0, value)) : 0;
  const percent = Math.round(safeValue / safeMax * 100);
  return (
    <div className={cn("min-w-0 space-y-2", className)}>
      <div className="flex flex-wrap justify-between gap-2 text-sm"><span className="text-text-secondary">{label}</span><span className="font-medium">{percent}% complete</span></div>
      <div {...props} role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={safeMax} aria-valuenow={safeValue} aria-valuetext={percent + "% complete"}
        className="h-2 overflow-hidden rounded-pill bg-border">
        <div className={cn("dovia-progress-fill h-full rounded-pill", tone === "accent" ? "dovia-accent-gradient" : "dovia-gradient-success")}
          style={{ width: percent + "%" }} />
      </div>
    </div>
  );
}
export default Progress;
