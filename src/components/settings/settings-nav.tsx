"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell, Plug, ShieldCheck, SlidersHorizontal, UserRound, Users, type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface SettingsNavItem { href: string; label: string; description: string; icon: LucideIcon; }

/** One canonical list drives the settings overview cards, the sub-navigation, and section headers. */
export const settingsSections: SettingsNavItem[] = [
  { href: "/settings/account", label: "Account", description: "Profile photo, name, email, job title, and timezone.", icon: UserRound },
  { href: "/settings/notifications", label: "Notifications", description: "Choose which meeting, task, and mention updates reach you.", icon: Bell },
  { href: "/settings/meeting-defaults", label: "Meeting Defaults", description: "Default duration, type, platform, reminder, and review behaviour.", icon: SlidersHorizontal },
  { href: "/settings/integrations", label: "Integrations", description: "Google Meet, Microsoft Teams, Zoom, and Slack connections.", icon: Plug },
  { href: "/settings/security", label: "Security", description: "Password, two-factor authentication, and active sessions.", icon: ShieldCheck },
  { href: "/settings/workspace", label: "Workspace", description: "Workspace name, language, timezone, date format, and appearance.", icon: Users },
];

function isActive(pathname: string, href: string) {
  return pathname === href || (href === "/settings" ? false : pathname.startsWith(href));
}

/** Horizontal on mobile, a sticky left rail from lg upwards. Shared by every settings route. */
export function SettingsNav() {
  const pathname = usePathname();
  return <nav aria-label="Settings sections" className="min-w-0">
    <ul role="list" className="flex min-w-0 gap-1 overflow-x-auto pb-1 lg:sticky lg:top-[calc(var(--topbar-height)+var(--space-4))] lg:flex-col lg:gap-2 lg:overflow-visible lg:pb-0">
      {settingsSections.map(section => {
        const Icon = section.icon;
        const active = isActive(pathname, section.href);
        return <li key={section.href} className="shrink-0 lg:shrink">
          <Link href={section.href} aria-current={active ? "page" : undefined}
            className={cn("flex min-h-11 items-center gap-2.5 rounded-default border px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-200 lg:whitespace-normal",
              active ? "border-primary bg-surface-hover text-primary" : "border-transparent text-text-secondary hover:bg-surface-soft hover:text-foreground hover:no-underline")}>
            <Icon aria-hidden="true" className="size-4 shrink-0" />
            {section.label}
          </Link>
        </li>;
      })}
    </ul>
  </nav>;
}
export default SettingsNav;