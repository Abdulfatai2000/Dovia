"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface TabItem { value: string; label: string; content: ReactNode; disabled?: boolean; }
export interface TabsProps {
  items: readonly TabItem[];
  label: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}
export function Tabs({ items, label, value, defaultValue, onValueChange, className }: TabsProps) {
  const id = useId();
  const [internalValue, setInternalValue] = useState(defaultValue);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const selected = value ?? internalValue;
  const active = items.find(item => item.value === selected && !item.disabled)?.value ?? items.find(item => !item.disabled)?.value;
  const select = (next: string) => { if (value === undefined) setInternalValue(next); onValueChange?.(next); };
  return <div className={cn("min-w-0", className)}>
    <div role="tablist" aria-label={label} aria-orientation="horizontal" className="flex max-w-full gap-1 overflow-x-auto border-b border-border p-1">
      {items.map((item, index) => <button key={item.value} ref={node => { buttons.current[index] = node; }}
        type="button" role="tab" id={id + "-tab-" + index} aria-controls={id + "-panel-" + index}
        aria-selected={active === item.value} disabled={item.disabled} tabIndex={active === item.value ? 0 : -1}
        onClick={() => select(item.value)}
        onKeyDown={event => {
          if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
          event.preventDefault();
          const enabled = items.map((entry, i) => !entry.disabled ? i : -1).filter(i => i >= 0);
          if (!enabled.length) return;
          const current = enabled.indexOf(index);
          const next = event.key === "Home" ? enabled[0] : event.key === "End" ? enabled[enabled.length - 1] :
            enabled[(current + (event.key === "ArrowRight" ? 1 : -1) + enabled.length) % enabled.length];
          select(items[next].value);
          buttons.current[next]?.focus();
        }}
        className={cn("relative min-h-11 shrink-0 rounded-default px-4 py-2 text-sm font-medium transition-[color,background-color] duration-200 disabled:cursor-not-allowed disabled:text-text-subtle",
            active === item.value ? "bg-surface-hover text-primary" : "text-text-secondary hover:bg-surface-soft hover:text-foreground")}>
        {item.label}
        {active === item.value && <span aria-hidden="true" className="dovia-accent-gradient absolute inset-x-2 -bottom-px h-0.5 rounded-pill" />}
      </button>)}
    </div>
    {items.map((item, index) => <div key={item.value} role="tabpanel" id={id + "-panel-" + index}
      aria-labelledby={id + "-tab-" + index} hidden={active !== item.value} tabIndex={0} className="min-w-0 pt-5">
      {item.content}
    </div>)}
  </div>;
}
export default Tabs;
