"use client";

import { useEffect, useState, type ReactNode } from "react";
import { MobileNav } from "./mobile-nav";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export function WorkspaceShell({ children }: { children: ReactNode }) {
  const [sidebarMode, setSidebarMode] = useState<"auto" | "expanded" | "collapsed">("auto");
  const [tablet, setTablet] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const changeSidebar = (mode: "expanded" | "collapsed") => {
    setSidebarMode(mode);
    requestAnimationFrame(() => {
      const label = mode === "collapsed" ? "Expand sidebar" : "Collapse sidebar";
      document.getElementById("workspace-sidebar")?.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`)?.focus();
    });
  };
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const compact = window.matchMedia("(min-width: 768px) and (max-width: 1023px)");
    const sync = () => setTablet(compact.matches);
    const close = () => setMobileOpen(false);
    const onBreakpoint = () => { if (desktop.matches) close(); };
    sync();
    compact.addEventListener("change", sync);
    desktop.addEventListener("change", onBreakpoint);
    window.addEventListener("popstate", close);
    return () => { compact.removeEventListener("change", sync); desktop.removeEventListener("change", onBreakpoint); window.removeEventListener("popstate", close); };
  }, []);
  // Mirrors the CSS rules in globals.css that collapse the sidebar at tablet width in auto mode.
  const collapsed = sidebarMode === "collapsed" || (sidebarMode === "auto" && tablet);
  return <div className="workspace-shell min-h-dvh bg-background" data-sidebar={sidebarMode}>
    <a href="#main-content" className="fixed top-3 left-3 z-[var(--z-skip)] rounded-default bg-primary px-4 py-3 text-sm font-medium text-on-brand shadow-default not-focus:sr-only focus:text-on-brand"
      onClick={() => document.getElementById("main-content")?.focus()}>Skip to main content</a>
    <Sidebar collapsed={collapsed} onCollapse={() => changeSidebar("collapsed")} onExpand={() => changeSidebar("expanded")} />
    <div className="min-w-0">
      <Topbar onOpenNavigation={() => setMobileOpen(true)} navigationOpen={mobileOpen} />
      <main id="main-content" tabIndex={-1} className="dovia-page min-h-[calc(100dvh-var(--topbar-height))] scroll-mt-24 focus-visible:outline-offset-[-4px]">{children}</main>
    </div>
    <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
  </div>;
}
export default WorkspaceShell;
