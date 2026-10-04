"use client";

import { CircleCheck, CircleAlert, Info, Sparkles, TriangleAlert, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconButton } from "./icon-button";

export type ToastVariant = "success" | "error" | "warning" | "info" | "ai";
export interface ToastProps {
  variant?: ToastVariant;
  title: string;
  description?: string;
  onDismiss?: () => void;
  className?: string;
}
const presentation = {
  success: { icon: CircleCheck, style: "bg-emerald-soft text-emerald-foreground" },
  error: { icon: CircleAlert, style: "bg-red-soft text-red-foreground" },
  warning: { icon: TriangleAlert, style: "bg-orange-soft text-orange-foreground" },
  info: { icon: Info, style: "bg-blue-soft text-blue-foreground" },
  ai: { icon: Sparkles, style: "bg-ai-soft text-ai-foreground" },
};
export function Toast({ variant = "info", title, description, onDismiss, className }: ToastProps) {
  const { icon: Icon, style } = presentation[variant];
  return <div role={variant === "error" ? "alert" : "status"} aria-atomic="true"
    className={cn("dovia-glass dovia-pop flex w-full max-w-md items-start gap-3 rounded-md border border-border-strong bg-surface p-4 shadow-lg", className)}>
    <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-default", style)}><Icon aria-hidden="true" className="size-4" /></span>
    <div className="min-w-0 flex-1 space-y-1"><p className="text-sm font-medium text-foreground"><span className="sr-only">{variant}: </span>{title}</p>{description && <p className="text-sm text-text-secondary">{description}</p>}</div>
    {onDismiss && <IconButton size="sm" aria-label="Dismiss notification" onClick={onDismiss}><X aria-hidden="true" /></IconButton>}
  </div>;
}
export default Toast;