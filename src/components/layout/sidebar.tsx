"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { Tooltip } from "@/components/ui/tooltip";
import { Brand } from "./brand";
import { SidebarNavigation } from "./sidebar-navigation";

export interface SidebarProps { onCollapse: () => void; onExpand: () => void; }
export function Sidebar({ onCollapse, onExpand }: SidebarProps) {
  return <aside id="workspace-sidebar" aria-label="Dovia sidebar" className="workspace-sidebar sticky top-0 hidden h-dvh min-h-0 flex-col bg-sidebar text-sidebar-text md:flex">
    <div className="flex h-[var(--topbar-height)] shrink-0 items-center px-4"><Brand /></div>
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pt-6 pb-4">
      <p className="sidebar-label mb-3 px-3 text-[11px] font-medium tracking-widest text-sidebar-muted uppercase">Workspace</p>
      <SidebarNavigation />
      <div className="mt-4 border-t border-sidebar-hover pt-3">
        <div className="sidebar-expanded-only flex items-center justify-between gap-2 pl-3">
          <span className="text-xs text-sidebar-muted">Turn ideas into action.</span>
          <IconButton aria-label="Collapse sidebar" aria-controls="workspace-sidebar" aria-expanded={true} onClick={onCollapse} className="text-sidebar-muted hover:bg-sidebar-hover hover:text-sidebar-text focus-visible:outline-sidebar-text"><PanelLeftClose aria-hidden="true" /></IconButton>
        </div>
        <div className="sidebar-collapsed-only"><Tooltip content="Expand sidebar"><IconButton aria-label="Expand sidebar" aria-controls="workspace-sidebar" aria-expanded={false} onClick={onExpand} className="text-sidebar-muted hover:bg-sidebar-hover hover:text-sidebar-text focus-visible:outline-sidebar-text"><PanelLeftOpen aria-hidden="true" /></IconButton></Tooltip></div>
      </div>
    </div>
  </aside>;
}
export default Sidebar;
