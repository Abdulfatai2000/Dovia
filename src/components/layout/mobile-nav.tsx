"use client";

import { Modal } from "@/components/ui/modal";
import { Brand } from "./brand";
import { SidebarNavigation } from "./sidebar-navigation";

export interface MobileNavProps { open: boolean; onClose: () => void; }
export function MobileNav({ open, onClose }: MobileNavProps) {
  return <Modal id="mobile-navigation" open={open} onClose={onClose} title="Workspace navigation" titleContent={<Brand compact onNavigate={onClose} />} placement="left" closeLabel="Close navigation"
    className="border-sidebar-hover bg-sidebar text-sidebar-text [&_button]:text-sidebar-text [&_button]:hover:bg-sidebar-hover [&_button]:focus-visible:outline-sidebar-text">
    <div className="flex min-h-[min(32rem,calc(100dvh-8rem))] flex-col">
      <p className="mb-4 px-3 text-xs font-medium tracking-widest text-sidebar-muted uppercase">Workspace</p>
      <SidebarNavigation mobile onNavigate={onClose} />
    </div>
  </Modal>;
}
export default MobileNav;
