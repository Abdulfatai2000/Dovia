import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Maps a workspace route to its Aurora accent personality. Specific routes win over area routes. */
export function accentForPath(pathname: string) {
  if (pathname.endsWith("/ai-review")) return "ai-review";
  if (pathname.endsWith("/follow-up")) return "follow-up";
  if (pathname === "/meetings" || pathname.startsWith("/meetings/")) return "meetings";
  if (pathname === "/tasks" || pathname.startsWith("/tasks/")) return "tasks";
  if (pathname === "/calendar" || pathname.startsWith("/calendar/")) return "calendar";
  if (pathname === "/team" || pathname.startsWith("/team/")) return "team";
  if (pathname === "/reports" || pathname.startsWith("/reports/")) return "reports";
  if (pathname === "/notifications" || pathname.startsWith("/notifications/")) return "notifications";
  if (pathname.startsWith("/settings")) return "settings";
  return "dashboard";
}

/** Sets `data-accent` on the document so section tokens resolve without prop drilling. */
export function RouteAccent() {
  const pathname = usePathname();
  const accent = accentForPath(pathname);
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-accent", accent);
    return () => { root.removeAttribute("data-accent"); };
  }, [accent]);
  return null;
}