"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { Button, type ButtonVariant } from "./button";
import { IconButton } from "./icon-button";
import { cn } from "@/lib/utils";

export interface ModalProps {
  id?: string;
  open: boolean;
  onClose: () => void;
  title: string;
  titleContent?: ReactNode;
  placement?: "center" | "left";
  closeLabel?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  onConfirm?: () => void;
  confirmLabel?: string;
  confirmVariant?: ButtonVariant;
  confirmDisabled?: boolean;
  confirmLoading?: boolean;
  size?: "sm" | "md" | "lg";
  closeOnBackdrop?: boolean;
  className?: string;
}
export function Modal({ id: dialogId, open, onClose, title, titleContent, placement = "center", closeLabel = "Close dialog", description, children, footer, onConfirm, confirmLabel = "Confirm", confirmVariant = "primary", confirmDisabled, confirmLoading, size = "md", closeOnBackdrop = true, className }: ModalProps) {
  const id = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const wasOpen = useRef(false);
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (!open) { if (element.open) element.close(); return; }
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (!element.open) element.showModal();
    titleRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      if (element.open) element.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [open]);
  // Keep native close events from effect cleanup from cancelling a subsequent open.
  useEffect(() => { wasOpen.current = open; }, [open]);
  return <dialog id={dialogId} ref={dialog} aria-modal="true" aria-labelledby={id + "-title"} aria-describedby={description ? id + "-description" : undefined}
    onKeyDown={event => {
      if (event.key !== "Tab") return;
      const focusable = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex], [contenteditable="true"]'))
        .filter(element => element.tabIndex >= 0 && !element.matches(":disabled") && element.getClientRects().length > 0 && !element.closest("[hidden], [inert]"));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first) { event.preventDefault(); titleRef.current?.focus(); return; }
      if (event.shiftKey && (document.activeElement === first || document.activeElement === titleRef.current)) {
        event.preventDefault(); last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    }}
    onCancel={event => { event.preventDefault(); onClose(); }}
    onClose={() => { if (wasOpen.current && !dialog.current?.open) onClose(); }}
    onClick={event => {
      if (!closeOnBackdrop || event.target !== event.currentTarget) return;
      const rect = event.currentTarget.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
    }}
    className={cn("dovia-modal", placement === "left" ? "dovia-drawer" : { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl" }[size], className)}>
    <div className="mb-5 flex items-start justify-between gap-4">
      <div className="min-w-0 space-y-2">
        <h2 ref={titleRef} tabIndex={-1} id={id + "-title"} className={cn("dovia-section-title break-words", titleContent && "sr-only")}>{title}</h2>
        {titleContent}
        {description && <p id={id + "-description"} className="text-sm text-text-secondary">{description}</p>}
      </div>
      <IconButton aria-label={closeLabel} onClick={onClose}><X aria-hidden="true" /></IconButton>
    </div>
    <div className="min-w-0">{children}</div>
    {(footer !== undefined || onConfirm) && <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-border pt-4">
      {footer ?? <><Button variant="outline" onClick={onClose}>Cancel</Button><Button variant={confirmVariant} onClick={onConfirm} disabled={confirmDisabled} loading={confirmLoading}>{confirmLabel}</Button></>}
    </div>}
  </dialog>;
}
export default Modal;
