"use client";

import { CircleCheck, CircleAlert, Info, TriangleAlert, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconButton } from "./icon-button";

export type ToastVariant = "success" | "error" | "warning" | "info";
export interface ToastProps {
  variant?: ToastVariant;
  title: string;
  description?: string;
  onDismiss?: () => void;
  className?: string;
}
const presentation = {
  success: { icon: CircleCheck, style: "bg-success-soft text-success-foreground" },
  error: { icon: CircleAlert, style: "bg-danger-soft text-danger-foreground" },
  warning: { icon: TriangleAlert, style: "bg-warning-soft text-warning-foreground" },
  info: { icon: Info, style: "bg-info-soft text-info-foreground" },
};
export function Toast({ variant = "info", title, description, onDismiss, className }: ToastProps) {
  const { icon: Icon, style } = presentation[variant];
  return <div role={variant === "error" ? "alert" : "status"} aria-atomic="true"
    className={cn("flex w-full max-w-md items-start gap-3 rounded-md border border-border bg-surface p-4 shadow-default", className)}>
    <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-default", style)}><Icon aria-hidden="true" className="size-4" /></span>
    <div className="min-w-0 flex-1 space-y-1"><p className="text-sm font-medium text-foreground"><span className="sr-only">{variant}: </span>{title}</p>{description && <p className="text-sm text-text-secondary">{description}</p>}</div>
    {onDismiss && <IconButton size="sm" aria-label="Dismiss notification" onClick={onDismiss}><X aria-hidden="true" /></IconButton>}
  </div>;
}
export default Toast;
