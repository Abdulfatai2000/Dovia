"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isNavigationActive, workspaceNavigation } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/ui/tooltip";

export function SidebarNavigation({ mobile = false, collapsed = false, onNavigate }: { mobile?: boolean; collapsed?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  return <nav aria-label={mobile ? "Mobile workspace" : "Workspace"} className="flex min-h-0 flex-1 flex-col gap-6">
    {(["primary", "footer"] as const).map(section => <ul key={section} className={cn("space-y-1.5", section === "footer" && "mt-auto border-t border-sidebar-hover pt-4")}>
      {workspaceNavigation.filter(item => item.section === section).map(item => {
        const active = isNavigationActive(pathname, item.href);
        const Icon = item.icon;
        const link = <Link href={item.href} onNavigate={onNavigate} aria-label={item.label} aria-current={active ? "page" : undefined}
          className={cn("sidebar-link group flex min-h-11 w-full items-center gap-3 rounded-default px-3 py-2.5 text-sm font-medium transition-colors duration-200 hover:no-underline focus-visible:outline-sidebar-text", active ? "dovia-gradient text-on-brand hover:text-on-brand" : "text-sidebar-text hover:bg-sidebar-hover hover:text-on-brand")}>
          <Icon aria-hidden="true" className={cn("size-5 shrink-0", active ? "text-on-brand" : "text-sidebar-muted group-hover:text-sidebar-text")} />
          <span className={cn("truncate", !mobile && "sidebar-label")}>{item.label}</span>
          {active && <span aria-hidden="true" className={cn("ml-auto size-1.5 shrink-0 rounded-pill bg-on-brand", !mobile && "sidebar-label")} />}
        </Link>;
        return <li key={item.href}>{collapsed ? <Tooltip content={item.label} wrapperClassName="flex w-full">{link}</Tooltip> : link}</li>;
      })}
    </ul>)}
  </nav>;
}
