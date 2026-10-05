"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell, Plug, ShieldCheck, SlidersHorizontal, UserRound, Users, type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface SettingsNavItem { id: string; href: string; label: string; icon: LucideIcon; }

/** One canonical list drives the settings tab bar, the dashboard cards, and the section routes. */
export const settingsNavItems: SettingsNavItem[] = [
  { id: "account", href: "/settings/account", label: "Account", icon: UserRound },
  { id: "notifications", href: "/settings/notifications", label: "Notifications", icon: Bell },
  { id: "meeting-defaults", href: "/settings/meeting-defaults", label: "Meeting Defaults", icon: SlidersHorizontal },
  { id: "integrations", href: "/settings/integrations", label: "Integrations", icon: Plug },
  { id: "security", href: "/settings/security", label: "Security", icon: ShieldCheck },
  { id: "workspace", href: "/settings/workspace", label: "Workspace", icon: Users },
];

function isActive(pathname: string, href: string) {
  return pathname === href;
}

/**
 * Wide horizontal segmented bar below the settings header.
 * Scrolls on narrow viewports instead of wrapping into a second column.
 */
export function SettingsTabs() {
  const pathname = usePathname();
  return <nav aria-label="Settings sections" className="min-w-0">
    <ul role="list" className="flex min-w-0 gap-1 overflow-x-auto rounded-lg border border-border bg-surface p-1">
      {settingsNavItems.map(item => {
        const Icon = item.icon;
        const active = isActive(pathname, item.href);
        return <li key={item.id} className="shrink-0">
          <Link href={item.href} aria-current={active ? "page" : undefined}
            className={cn("flex min-h-11 items-center gap-2 rounded-default px-4 py-2 text-sm font-medium whitespace-nowrap transition-[color,background-color,box-shadow] duration-200",
              active ? "dovia-accent-soft dovia-accent-text shadow-sm" : "text-text-secondary hover:bg-surface-soft hover:text-foreground hover:no-underline")}>
            <Icon aria-hidden="true" className="size-4 shrink-0" />
            {item.label}
          </Link>
        </li>;
      })}
    </ul>
  </nav>;
}
export default SettingsTabs;