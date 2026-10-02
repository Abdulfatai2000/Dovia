"use client";

import { CircleAlert } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

export interface ErrorStateProps { title?: string; description?: string; onRetry?: () => void; retryLabel?: string; className?: string; }
export function ErrorState({ title = "Something went wrong", description = "Please try again.", onRetry, retryLabel = "Try again", className }: ErrorStateProps) {
  return <div className={cn("space-y-4 rounded-lg border border-danger bg-danger-soft p-[var(--card-padding)]", className)}>
    <div role="alert" className="flex items-start gap-3">
      <CircleAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-danger-foreground" />
      <div className="min-w-0 space-y-1"><h3 className="font-medium text-danger-foreground">{title}</h3><p className="text-sm text-text-secondary">{description}</p></div>
    </div>
    {onRetry && <Button variant="outline" onClick={onRetry}>{retryLabel}</Button>}
  </div>;
}
