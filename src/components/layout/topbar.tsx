"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Bell, CalendarDays, CircleAlert, LogOut, Menu, Search, Settings, ShieldCheck, SquareCheckBig, UserRound, X } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dropdown, type DropdownItem } from "@/components/ui/dropdown";
import { IconButton } from "@/components/ui/icon-button";
import { SearchInput } from "@/components/ui/search-input";
import { Toast } from "@/components/ui/toast";
import { currentUserPreview } from "@/data/mock/current-user";
import { notificationPreviews } from "@/data/mock/notifications";
import { Brand } from "./brand";

const notificationIcons = { assignment: SquareCheckBig, meeting: CalendarDays, overdue: CircleAlert };
const searchPlaceholder = "Search meetings, tasks, people, or topics...";

export interface TopbarProps { onOpenNavigation: () => void; navigationOpen: boolean; }
export function Topbar({ onOpenNavigation, navigationOpen }: TopbarProps) {
  const [query, setQuery] = useState("");
  const [mobileSearch, setMobileSearch] = useState(false);
  const [signOutNotice, setSignOutNotice] = useState(false);
  const searchField = useRef<HTMLInputElement>(null);
  const searchTrigger = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (mobileSearch) searchField.current?.focus(); }, [mobileSearch]);
  const closeSearch = () => { setMobileSearch(false); searchTrigger.current?.focus(); };
  const notifications: DropdownItem[] = notificationPreviews.map(item => {
    const Icon = notificationIcons[item.kind];
    return { id: item.id, label: item.title, description: item.description, meta: item.timeLabel, href: item.href, icon: <Icon /> };
  });
  notifications.push({ id: "all", label: "View all notifications", href: "/notifications", icon: <ArrowRight />, separatorBefore: true });
  const profileItems: DropdownItem[] = [
    { id: "account", label: "Profile / Account", href: "/settings/account", icon: <UserRound /> },
    { id: "workspace", label: "Workspace settings", href: "/settings/workspace", icon: <Settings /> },
    { id: "notifications", label: "Notifications", href: "/settings/notifications", icon: <Bell /> },
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
        <SearchInput label="Search workspace" placeholder={searchPlaceholder} value={query} onChange={event => setQuery(event.target.value)} wrapperClassName="hidden min-w-0 flex-1 md:block md:max-w-xl" className="bg-surface-soft" />
        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
          <IconButton ref={searchTrigger} className="md:hidden" aria-label="Search" aria-expanded={mobileSearch} aria-controls="mobile-workspace-search" onClick={() => setMobileSearch(!mobileSearch)}><Search aria-hidden="true" /></IconButton>
          <Dropdown label="Open notifications" triggerDescription={notificationPreviews.length + " unread preview notifications"} iconOnly variant="ghost" menuSize="md"
            header={<div className="flex items-center justify-between gap-3"><span className="text-sm font-semibold">Notifications</span><Badge variant="primary">{notificationPreviews.length} unread</Badge></div>}
            trigger={<span className="relative"><Bell aria-hidden="true" /><span aria-hidden="true" className="absolute -top-1 -right-0.5 size-2 rounded-pill border-2 border-surface bg-danger" /></span>} items={notifications} />
          <div className="hidden h-7 w-px bg-border sm:block" aria-hidden="true" />
          <Dropdown label="Open profile menu" variant="ghost" triggerClassName="gap-2 px-1.5 [&>svg]:hidden lg:[&>svg]:block"
            trigger={<><Avatar name={currentUserPreview.name} size="sm" /><span className="hidden text-left lg:block"><span className="block text-sm font-medium text-foreground">{currentUserPreview.name}</span><span className="block text-xs font-normal text-text-muted">{currentUserPreview.role}</span></span></>} items={profileItems} />
        </div>
      </div>
      {mobileSearch && <div id="mobile-workspace-search" className="flex items-center gap-2 border-t border-border p-4 md:hidden">
        <SearchInput ref={searchField} label="Search workspace" placeholder={searchPlaceholder} value={query} onChange={event => setQuery(event.target.value)} onKeyDown={event => { if (event.key === "Escape") closeSearch(); }} wrapperClassName="min-w-0 flex-1" />
        <IconButton aria-label="Close search" onClick={closeSearch}><X aria-hidden="true" /></IconButton>
      </div>}
    </header>
    {signOutNotice && <div className="fixed right-4 bottom-4 left-4 z-[var(--z-toast)] sm:left-auto"><Toast title="Authentication will be connected later." description="Sign out is a preview action for now." onDismiss={() => setSignOutNotice(false)} /></div>}
  </>;
}
export default Topbar;
