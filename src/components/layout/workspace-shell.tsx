"use client";

import { useEffect, useState, type ReactNode } from "react";
import { MobileNav } from "./mobile-nav";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export function WorkspaceShell({ children }: { children: ReactNode }) {
  const [sidebarMode, setSidebarMode] = useState<"auto" | "expanded" | "collapsed">("auto");
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const close = () => setMobileOpen(false);
    const onBreakpoint = () => { if (desktop.matches) close(); };
    desktop.addEventListener("change", onBreakpoint);
    window.addEventListener("popstate", close);
    return () => { desktop.removeEventListener("change", onBreakpoint); window.removeEventListener("popstate", close); };
  }, []);
  return <div className="workspace-shell min-h-dvh bg-background" data-sidebar={sidebarMode}>
    <a href="#main-content" className="fixed top-3 left-3 z-[var(--z-skip)] rounded-default bg-primary px-4 py-3 text-sm font-medium text-on-brand shadow-default not-focus:sr-only focus:text-on-brand"
      onClick={() => document.getElementById("main-content")?.focus()}>Skip to main content</a>
    <Sidebar onCollapse={() => setSidebarMode("collapsed")} onExpand={() => setSidebarMode("expanded")} />
    <div className="min-w-0">
      <Topbar onOpenNavigation={() => setMobileOpen(true)} navigationOpen={mobileOpen} />
      <main id="main-content" tabIndex={-1} className="dovia-page min-h-[calc(100dvh-var(--topbar-height))] scroll-mt-24 focus-visible:outline-offset-[-4px]">{children}</main>
    </div>
    <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
  </div>;
}
export default WorkspaceShell;
