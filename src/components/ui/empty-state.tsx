import type { ComponentPropsWithRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps extends Omit<ComponentPropsWithRef<"div">, "title"> { icon?: ReactNode; title: string; description: string; action?: ReactNode; }
export function EmptyState({ icon, title, description, action, className, ...props }: EmptyStateProps) {
  return <div {...props} className={cn("flex min-w-0 flex-col items-center gap-4 rounded-lg border border-dashed border-border-strong bg-surface px-4 py-10 text-center sm:px-6", className)}>
    {icon && <span aria-hidden="true" className="dovia-gradient-ai flex size-12 items-center justify-center rounded-lg text-on-brand shadow-glow-ai [&_svg]:size-6">{icon}</span>}
    <div className="max-w-md space-y-2"><h3 className="dovia-card-title break-words">{title}</h3><p className="text-sm leading-relaxed text-text-secondary">{description}</p></div>
    {action && <div className="max-w-full">{action}</div>}
  </div>;
}