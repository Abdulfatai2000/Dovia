"use client";

import Link from "next/link";
import { CalendarCheck, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { Tooltip } from "@/components/ui/tooltip";
import { Brand } from "./brand";
import { SidebarNavigation } from "./sidebar-navigation";

export interface SidebarProps { collapsed: boolean; onCollapse: () => void; onExpand: () => void; }
export function Sidebar({ collapsed, onCollapse, onExpand }: SidebarProps) {
  return <aside id="workspace-sidebar" aria-label="Dovia sidebar" className="workspace-sidebar sticky top-0 hidden h-dvh min-h-0 flex-col bg-sidebar text-sidebar-text md:flex">
    <div className="flex h-[var(--topbar-height)] shrink-0 items-center px-4"><Brand /></div>
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pt-6 pb-4">
      <p className="sidebar-label mb-3 px-3 text-[11px] font-medium tracking-widest text-sidebar-muted uppercase">Workspace</p>
      <SidebarNavigation collapsed={collapsed} />

      <div className="sidebar-expanded-only mt-6 rounded-lg border border-sidebar-hover bg-sidebar-secondary p-4">
        <span aria-hidden="true" className="dovia-gradient mb-3 flex size-9 items-center justify-center rounded-default text-on-brand">
          <CalendarCheck className="size-4" />
        </span>
        <p className="text-sm font-semibold text-sidebar-text">Turn meetings into action</p>
        <p className="mt-1.5 text-xs leading-relaxed text-sidebar-muted">Keep decisions, owners, deadlines, and follow-up work in one place.</p>
        <Link href="/features"
          className="mt-3 inline-flex min-h-9 w-full items-center justify-center gap-1.5 rounded-default bg-sidebar-hover px-3 py-1.5 text-xs font-semibold text-sidebar-text transition-colors duration-200 hover:bg-primary hover:text-on-brand hover:no-underline">
          Explore Dovia
        </Link>
      </div>

      <div className="mt-4 border-t border-sidebar-hover pt-3">
        <div className="sidebar-expanded-only flex items-center justify-between gap-2 pl-3">
          <span className="text-xs text-sidebar-muted">Turn conversations into action.</span>
          <IconButton aria-label="Collapse sidebar" aria-controls="workspace-sidebar" aria-expanded={true} onClick={onCollapse} className="text-sidebar-muted hover:bg-sidebar-hover hover:text-sidebar-text focus-visible:outline-sidebar-text"><PanelLeftClose aria-hidden="true" /></IconButton>
        </div>
        <div className="sidebar-collapsed-only"><Tooltip content="Expand sidebar"><IconButton aria-label="Expand sidebar" aria-controls="workspace-sidebar" aria-expanded={false} onClick={onExpand} className="text-sidebar-muted hover:bg-sidebar-hover hover:text-sidebar-text focus-visible:outline-sidebar-text"><PanelLeftOpen aria-hidden="true" /></IconButton></Tooltip></div>
      </div>
    </div>
  </aside>;
}
export default Sidebar;