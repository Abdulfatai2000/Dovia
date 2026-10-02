import { Calendar, CalendarDays, ChartNoAxesColumnIncreasing, LayoutDashboard, Settings, SquareCheckBig, Users, type LucideIcon } from "lucide-react";

export interface NavigationItem {
  label: string;
  href: string;
  icon: LucideIcon;
  section: "primary" | "footer";
}

/** Shared by the desktop rail and mobile drawer. */
export const workspaceNavigation: readonly NavigationItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, section: "primary" },
  { label: "Meetings", href: "/meetings", icon: CalendarDays, section: "primary" },
  { label: "My Tasks", href: "/tasks", icon: SquareCheckBig, section: "primary" },
  { label: "Calendar", href: "/calendar", icon: Calendar, section: "primary" },
  { label: "Team", href: "/team", icon: Users, section: "primary" },
  { label: "Reports", href: "/reports", icon: ChartNoAxesColumnIncreasing, section: "primary" },
  { label: "Settings", href: "/settings", icon: Settings, section: "footer" },
];

export function isNavigationActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}
