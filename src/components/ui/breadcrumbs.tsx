import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem { label: string; href?: string; }
export interface BreadcrumbsProps { items: readonly BreadcrumbItem[]; className?: string; }

/** Explicit labels avoid deriving names from opaque route IDs. The last item is current. */
export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  if (!items.length) return null;
  return <nav aria-label="Breadcrumb" className={className}><ol className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-sm">
    {items.map((item, index) => <li key={index} className="flex min-w-0 items-center gap-2">
      {index > 0 && <ChevronRight aria-hidden="true" className="size-3.5 shrink-0 text-text-muted" />}
      {index === items.length - 1 ? <span aria-current="page" className="break-words text-text-secondary">{item.label}</span> : item.href ? <Link href={item.href} className={cn("rounded-sm break-words text-text-muted hover:text-primary")}>{item.label}</Link> : <span className="break-words text-text-muted">{item.label}</span>}
    </li>)}
  </ol></nav>;
}
