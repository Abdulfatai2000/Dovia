"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { Button, type ButtonVariant } from "./button";
import { cn } from "@/lib/utils";

export interface DropdownItem { id: string; label: string; icon?: ReactNode; disabled?: boolean; destructive?: boolean; onSelect: () => void; }
export interface DropdownProps {
  trigger: ReactNode;
  label: string;
  items: readonly DropdownItem[];
  disabled?: boolean;
  align?: "start" | "end";
  variant?: ButtonVariant;
  className?: string;
}
export function Dropdown({ trigger, label, items, disabled, align = "end", variant = "outline", className }: DropdownProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const initialFocus = useRef<"first" | "last">("first");
  const search = useRef({ text: "", time: 0 });
  const close = (restoreFocus = false) => { setOpen(false); if (restoreFocus) triggerRef.current?.focus(); };

  useEffect(() => {
    if (!open) return;
    const entries = menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not(:disabled)');
    const index = initialFocus.current === "last" ? (entries?.length ?? 1) - 1 : 0;
    (entries?.[index] ?? menuRef.current)?.focus();
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !root.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);

  return <div ref={root} className={cn("relative inline-block max-w-full", className)}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) close(); }}>
    <Button ref={triggerRef} id={id + "-trigger"} variant={variant} disabled={disabled} aria-label={label}
      aria-haspopup="menu" aria-expanded={open} aria-controls={open ? id + "-menu" : undefined}
      onClick={() => { initialFocus.current = "first"; setOpen(!open); }}
      onKeyDown={event => {
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          event.preventDefault(); initialFocus.current = event.key === "ArrowUp" ? "last" : "first"; setOpen(true);
        }
      }}>
      {trigger}<ChevronDown aria-hidden="true" />
    </Button>
    {open && <div ref={menuRef} id={id + "-menu"} role="menu" aria-labelledby={id + "-trigger"} tabIndex={-1}
      className={cn("absolute top-full z-30 mt-2 max-h-72 w-56 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-md border border-border bg-surface p-1.5 shadow-lg", align === "end" ? "right-0" : "left-0")}
      onKeyDown={event => {
        const entries = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not(:disabled)'));
        const current = entries.indexOf(document.activeElement as HTMLButtonElement);
        if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); close(true); return; }
        if (event.key === "Tab") { close(); return; }
        if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
          event.preventDefault();
          const index = event.key === "Home" ? 0 : event.key === "End" ? entries.length - 1 :
            (current + (event.key === "ArrowDown" ? 1 : -1) + entries.length) % entries.length;
          entries[index]?.focus();
        } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey && event.key !== " ") {
          event.preventDefault();
          const now = Date.now();
          search.current.text = now - search.current.time > 500 ? event.key : search.current.text + event.key;
          search.current.time = now;
          const query = search.current.text.toLocaleLowerCase();
          const ordered = [...entries.slice(current + 1), ...entries.slice(0, current + 1)];
          ordered.find(entry => entry.textContent?.trim().toLocaleLowerCase().startsWith(query))?.focus();
        }
      }}>
      {items.map(item => <button type="button" key={item.id} role="menuitem" disabled={item.disabled} tabIndex={-1}
        onClick={() => { close(true); item.onSelect(); }}
        className={cn("flex min-h-11 w-full items-center gap-2 rounded-sm px-3 py-2 text-left text-sm transition-colors duration-200 hover:bg-surface-hover disabled:cursor-not-allowed disabled:text-text-subtle [&_svg]:size-4 [&_svg]:shrink-0", item.destructive ? "text-danger-foreground" : "text-text-secondary")}>
        {item.icon && <span aria-hidden="true">{item.icon}</span>}{item.label}
      </button>)}
    </div>}
  </div>;
}
export default Dropdown;
