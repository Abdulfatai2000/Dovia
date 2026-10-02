import type { ComponentPropsWithRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface PageHeaderProps extends Omit<ComponentPropsWithRef<"header">, "title"> {
  title: string;
  eyebrow?: string;
  description?: string;
  actions?: ReactNode;
  breadcrumbs?: ReactNode;
}
export function PageHeader({ title, eyebrow, description, actions, breadcrumbs, className, ...props }: PageHeaderProps) {
  return <header {...props} className={cn("min-w-0 space-y-4", className)}>
    {breadcrumbs && <nav aria-label="Breadcrumb">{breadcrumbs}</nav>}
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div className="min-w-0 space-y-2">
        {eyebrow && <p className="text-xs font-medium tracking-wider text-primary uppercase">{eyebrow}</p>}
        <h1 className="dovia-page-title break-words">{title}</h1>
        {description && <p className="max-w-2xl text-base leading-relaxed text-text-secondary">{description}</p>}
      </div>
      {actions && <div className="flex max-w-full flex-wrap items-center gap-2 md:justify-end">{actions}</div>}
    </div>
  </header>;
}
