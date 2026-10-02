import type { ComponentPropsWithRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SectionHeaderProps extends Omit<ComponentPropsWithRef<"div">, "title"> { title: string; description?: string; action?: ReactNode; }
export function SectionHeader({ title, description, action, className, ...props }: SectionHeaderProps) {
  return <div {...props} className={cn("flex min-w-0 flex-wrap items-start justify-between gap-3", className)}>
    <div className="min-w-0 space-y-1"><h2 className="dovia-section-title break-words">{title}</h2>{description && <p className="text-sm text-text-secondary">{description}</p>}</div>
    {action && <div className="max-w-full">{action}</div>}
  </div>;
}
