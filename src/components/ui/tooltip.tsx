"use client";

import { cloneElement, useEffect, useId, useRef, useState, type ReactElement } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export interface TooltipProps {
  content: string;
  wrapperClassName?: string;
  /** A focusable element that forwards aria-describedby; keep an accessible name on icon buttons. */
  children: ReactElement<{ "aria-describedby"?: string }>;
}

export function Tooltip({ content, children, wrapperClassName }: TooltipProps) {
  const id = useId();
  const root = useRef<HTMLSpanElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [position, setPosition] = useState<{ left: number; top: number; above: boolean; container: HTMLElement } | null>(null);
  const cancelTimer = () => { if (timer.current) clearTimeout(timer.current); };
  const hide = () => { cancelTimer(); setPosition(null); };
  const show = () => {
    cancelTimer();
    const rect = root.current?.getBoundingClientRect();
    if (!rect) return;
    const width = Math.min(256, window.innerWidth - 32);
    setPosition({ left: Math.max(16, Math.min(rect.left + rect.width / 2 - width / 2, window.innerWidth - width - 16)), top: rect.top > 160 ? rect.top - 8 : rect.bottom + 8, above: rect.top > 160, container: root.current?.closest("dialog") ?? document.body });
  };
  const scheduleHide = () => { cancelTimer(); timer.current = setTimeout(() => setPosition(null), 150); };
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  useEffect(() => {
    if (!position) return;
    const dismiss = () => setPosition(null);
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") { event.stopPropagation(); setPosition(null); } };
    document.addEventListener("keydown", escape, true);
    window.addEventListener("resize", dismiss);
    window.addEventListener("scroll", dismiss, true);
    return () => { document.removeEventListener("keydown", escape, true); window.removeEventListener("resize", dismiss); window.removeEventListener("scroll", dismiss, true); };
  }, [position]);
  return <>
    <span ref={root} className={cn("inline-flex max-w-full", wrapperClassName)} onMouseEnter={show} onMouseLeave={scheduleHide} onFocus={show} onBlur={hide}>
      {cloneElement(children, { "aria-describedby": [children.props["aria-describedby"], id].filter(Boolean).join(" ") })}
    </span>
    {!position && <span id={id} role="tooltip" className="sr-only">{content}</span>}
    {position && createPortal(<span id={id} role="tooltip" onMouseEnter={cancelTimer} onMouseLeave={scheduleHide}
      className="fixed z-[var(--z-tooltip)] w-64 max-w-[calc(100vw-2rem)] rounded-default bg-sidebar px-3 py-2 text-xs leading-relaxed text-sidebar-text shadow-default"
      style={{ left: position.left, top: position.top, transform: position.above ? "translateY(-100%)" : undefined }}>{content}</span>, position.container)}
  </>;
}
