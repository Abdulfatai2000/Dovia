"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { Button, type ButtonVariant } from "./button";
import { IconButton } from "./icon-button";
import { cn } from "@/lib/utils";

type ItemDestination = { href: string; onSelect?: never } | { href?: never; onSelect: () => void };
export type DropdownItem = ItemDestination & {
  id: string;
  label: string;
  description?: string;
  meta?: string;
  icon?: ReactNode;
  disabled?: boolean;
  destructive?: boolean;
  separatorBefore?: boolean;
};
export interface DropdownProps {
  trigger: ReactNode;
  label: string;
  items: readonly DropdownItem[];
  disabled?: boolean;
  align?: "start" | "end";
  variant?: ButtonVariant;
  className?: string;
  triggerClassName?: string;
  triggerDescription?: string;
  iconOnly?: boolean;
  menuSize?: "sm" | "md";
  header?: ReactNode;
}
const enabledItems = '[role="menuitem"]:not(:disabled):not([aria-disabled="true"])';

export function Dropdown({ trigger, label, items, disabled, align = "end", variant = "outline", className, triggerClassName, triggerDescription, iconOnly = false, menuSize = "sm", header }: DropdownProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ left: 0, above: false });
  const root = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const initialFocus = useRef<"first" | "last">("first");
  const search = useRef({ text: "", time: 0 });
  const close = (restoreFocus = false) => { setOpen(false); if (restoreFocus) triggerRef.current?.focus(); };
  const show = (focus: "first" | "last") => {
    const rect = root.current?.getBoundingClientRect();
    if (rect) {
      const width = Math.min(menuSize === "md" ? 352 : 224, window.innerWidth - 32);
      const preferred = align === "end" ? rect.right - width : rect.left;
      const left = Math.max(16, Math.min(preferred, window.innerWidth - width - 16)) - rect.left;
      setPosition({ left, above: rect.bottom + 300 > window.innerHeight && rect.top > window.innerHeight - rect.bottom });
    }
    search.current = { text: "", time: 0 };
    initialFocus.current = focus;
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const entries = menuRef.current?.querySelectorAll<HTMLElement>(enabledItems);
    const index = initialFocus.current === "last" ? (entries?.length ?? 1) - 1 : 0;
    (entries?.[index] ?? menuRef.current)?.focus();
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !root.current?.contains(event.target)) setOpen(false);
    };
    const resize = () => { setOpen(false); triggerRef.current?.focus(); };
    document.addEventListener("pointerdown", outside);
    window.addEventListener("resize", resize);
    return () => { document.removeEventListener("pointerdown", outside); window.removeEventListener("resize", resize); };
  }, [open]);

  const Trigger = iconOnly ? IconButton : Button;
  return <div ref={root} className={cn("relative inline-block max-w-full", className)}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) close(); }}>
    <Trigger ref={triggerRef} id={id + "-trigger"} variant={variant} disabled={disabled} aria-label={label}
      aria-describedby={triggerDescription ? id + "-description" : undefined} className={triggerClassName}
      aria-haspopup="menu" aria-expanded={open} aria-controls={open ? id + "-menu" : undefined}
      onClick={() => { if (open) close(); else show("first"); }}
      onKeyDown={event => {
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          event.preventDefault(); show(event.key === "ArrowUp" ? "last" : "first");
        }
      }}>
      {trigger}{!iconOnly && <ChevronDown aria-hidden="true" />}
    </Trigger>
    {triggerDescription && <span id={id + "-description"} className="sr-only">{triggerDescription}</span>}
    {open && <div style={{ left: position.left }}
      className={cn("absolute z-[var(--z-dropdown)] max-h-[min(28rem,calc(100dvh-6rem))] max-w-[calc(100vw-2rem)] overflow-y-auto rounded-md border border-border bg-surface shadow-lg", menuSize === "md" ? "w-88" : "w-56", position.above ? "bottom-full mb-2" : "top-full mt-2")}>
      {header && <div className="border-b border-border px-4 py-3">{header}</div>}
      <div ref={menuRef} id={id + "-menu"} role="menu" aria-labelledby={id + "-trigger"} tabIndex={-1} className="p-1.5"
        onKeyDown={event => {
          const entries = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(enabledItems));
          const current = entries.indexOf(document.activeElement as HTMLElement);
          if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); close(true); return; }
          if (event.key === "Tab") return;
          if (event.key === " " && document.activeElement instanceof HTMLAnchorElement) { event.preventDefault(); document.activeElement.click(); return; }
          if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
            event.preventDefault();
            const index = event.key === "Home" ? 0 : event.key === "End" ? entries.length - 1 :
              (current + (event.key === "ArrowDown" ? 1 : -1) + entries.length) % entries.length;
            entries[index]?.focus();
          } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey && event.key !== " ") {
            event.preventDefault();
            const now = event.timeStamp;
            search.current.text = now - search.current.time > 500 ? event.key : search.current.text + event.key;
            search.current.time = now;
            const query = search.current.text.toLocaleLowerCase();
            const ordered = [...entries.slice(current + 1), ...entries.slice(0, current + 1)];
            ordered.find(entry => entry.dataset.label?.toLocaleLowerCase().startsWith(query))?.focus();
          }
        }}>
        {items.map(item => {
          const itemClass = cn("flex min-h-11 w-full items-start gap-3 rounded-sm px-3 py-2.5 text-left text-sm transition-colors duration-200 hover:bg-surface-hover hover:no-underline disabled:cursor-not-allowed disabled:text-text-subtle aria-disabled:cursor-not-allowed aria-disabled:text-text-subtle [&_svg]:size-4 [&_svg]:shrink-0", item.destructive ? "text-danger-foreground hover:text-danger-foreground" : "text-text-secondary hover:text-foreground");
          const body = <>{item.icon && <span aria-hidden="true" className="mt-0.5 shrink-0">{item.icon}</span>}<span className="min-w-0 flex-1"><span className="block font-medium">{item.label}</span>{item.description && <span className="mt-1 block text-xs leading-relaxed text-text-muted">{item.description}</span>}{item.meta && <span className="mt-1 block text-xs text-text-muted">{item.meta}</span>}</span></>;
          return <div key={item.id} role="none">
            {item.separatorBefore && <div role="separator" className="my-1 border-t border-border" />}
            {item.href !== undefined ? <Link href={item.href} role="menuitem" tabIndex={-1} aria-disabled={item.disabled || undefined} data-label={item.label} className={itemClass}
              onClick={event => { if (item.disabled) event.preventDefault(); else close(true); }}>{body}</Link> :
              <button type="button" role="menuitem" disabled={item.disabled} tabIndex={-1} data-label={item.label} className={itemClass}
                onClick={() => { close(true); item.onSelect(); }}>{body}</button>}
          </div>;
        })}
      </div>
    </div>}
  </div>;
}
export default Dropdown;
