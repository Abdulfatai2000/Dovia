"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, Bell, LogOut, Menu, Search, Settings, ShieldCheck, UserRound, X } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dropdown, type DropdownItem } from "@/components/ui/dropdown";
import { IconButton } from "@/components/ui/icon-button";
import { Toast } from "@/components/ui/toast";
import { GlobalSearch } from "@/components/search/global-search";
import { useNotifications } from "@/hooks/use-notifications";
import { useDemoQuery } from "@/hooks/use-demo-query";
import { getNotifications } from "@/services/notification.service";
import { getCurrentUser } from "@/services/team.service";
import { Brand } from "./brand";

const searchPlaceholder = "Search meetings, tasks, people, or topics...";
const timeLabel = (timestamp: string) => timestamp.slice(0, 10);

export interface TopbarProps { onOpenNavigation: () => void; navigationOpen: boolean; }
export function Topbar({ onOpenNavigation, navigationOpen }: TopbarProps) {
  const [query, setQuery] = useState("");
  const [mobileSearch, setMobileSearch] = useState(false);
  const [signOutNotice, setSignOutNotice] = useState(false);
  const searchField = useRef<HTMLInputElement>(null);
  const searchTrigger = useRef<HTMLButtonElement>(null);
  const searchArea = useRef<HTMLDivElement>(null);
  const { unread } = useNotifications();

  // One notification source: the same service state the /notifications page mutates.
  const load = useCallback(() => getNotifications().slice(0, 5), []);
  const { data: previews } = useDemoQuery(load);
  const user = getCurrentUser();

  useEffect(() => { if (mobileSearch) searchField.current?.focus(); }, [mobileSearch]);
  useEffect(() => {
    const onShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setMobileSearch(true); }
    };
    window.addEventListener("keydown", onShortcut);
    return () => window.removeEventListener("keydown", onShortcut);
  }, []);
  useEffect(() => {
    if (!query.trim()) return;
    const onPointerDown = (event: PointerEvent) => { if (!searchArea.current?.contains(event.target as Node)) setQuery(""); };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [query]);

  const closeSearch = () => { setMobileSearch(false); setQuery(""); searchTrigger.current?.focus(); };

  const notificationItems: DropdownItem[] = (previews ?? []).map(item => ({
    id: item.id, label: item.title, description: item.description,
    meta: `${item.read ? "Read" : "Unread"} · ${timeLabel(item.timestamp)}`, href: item.href ?? "/notifications",
  }));
  if (notificationItems.length) notificationItems.push({ id: "all", label: "View all notifications", href: "/notifications", icon: <ArrowRight />, separatorBefore: true });

  const profileItems: DropdownItem[] = [
    { id: "account", label: "Profile / Account", href: "/settings/account", icon: <UserRound /> },
    { id: "workspace", label: "Workspace settings", href: "/settings/workspace", icon: <Settings /> },
    { id: "notifications", label: "Notification preferences", href: "/settings/notifications", icon: <Bell /> },
    { id: "security", label: "Security", href: "/settings/security", icon: <ShieldCheck /> },
    { id: "sign-out", label: "Sign out", icon: <LogOut />, separatorBefore: true, onSelect: () => setSignOutNotice(true) },
  ];

  return <>
    <header className="sticky top-0 z-[var(--z-chrome)] border-b border-border bg-surface">
      <div className="flex h-[var(--topbar-height)] min-w-0 items-center gap-2 px-4 md:gap-4 md:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-1 md:hidden">
          <IconButton aria-label="Open navigation" aria-haspopup="dialog" aria-controls="mobile-navigation" aria-expanded={navigationOpen} onClick={onOpenNavigation}><Menu aria-hidden="true" /></IconButton>
          <Brand compact className="gap-0 text-foreground [&>img]:size-8 [&>span]:text-lg" />
        </div>
        <div ref={searchArea} className="hidden min-w-0 flex-1 md:block md:max-w-xl">
          <GlobalSearch value={query} onChange={setQuery} onClose={() => { setQuery(""); searchField.current?.focus(); }}
            inputRef={searchField} placeholder={searchPlaceholder} floating />
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
          <IconButton ref={searchTrigger} className="md:hidden" aria-label="Search" aria-expanded={mobileSearch} aria-controls="mobile-workspace-search" onClick={() => setMobileSearch(!mobileSearch)}><Search aria-hidden="true" /></IconButton>
          <Dropdown label="Open notifications" triggerDescription={unread === 0 ? "No unread notifications" : `${unread} unread notification${unread === 1 ? "" : "s"}`} iconOnly variant="ghost" menuSize="md"
            header={<div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold">Notifications</span>
              <Badge variant={unread === 0 ? "neutral" : "primary"}>{unread} unread</Badge>
            </div>}
            trigger={<span className="relative">
              <Bell aria-hidden="true" />
              {unread > 0 && <span aria-hidden="true" className="absolute -top-1 -right-0.5 size-2 rounded-pill border-2 border-surface bg-danger" />}
            </span>} items={notificationItems} />
          <div className="hidden h-7 w-px bg-border sm:block" aria-hidden="true" />
          <Dropdown label="Open profile menu" variant="ghost" triggerClassName="gap-2 px-1.5 [&>svg]:hidden lg:[&>svg]:block"
            trigger={<><Avatar name={user.name} size="sm" /><span className="hidden text-left lg:block"><span className="block text-sm font-medium text-foreground">{user.name}</span><span className="block text-xs font-normal text-text-muted">{user.role}</span></span></>} items={profileItems} />
        </div>
      </div>
      {mobileSearch && <div id="mobile-workspace-search" className="border-t border-border p-4 md:hidden">
        <GlobalSearch value={query} onChange={setQuery} onClose={closeSearch} inputRef={searchField} placeholder={searchPlaceholder} floating />
        <div className="mt-3 flex justify-end">
          <IconButton aria-label="Close search" onClick={closeSearch}><X aria-hidden="true" /></IconButton>
        </div>
      </div>}
    </header>
    {signOutNotice && <div className="fixed right-4 bottom-4 left-4 z-[var(--z-toast)] sm:left-auto"><Toast title="Authentication will be connected later." description="Sign out is a preview action for now." onDismiss={() => setSignOutNotice(false)} /></div>}
  </>;
}
export default Topbar;