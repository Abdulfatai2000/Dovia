"use client";

import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface IntegrationCardProps {
  name: string;
  description: string;
  monogram: string;
  status: string;
  statusTone?: "neutral" | "info";
  actionLabel?: string;
  onAction: () => void;
  children?: ReactNode;
  className?: string;
}

/**
 * Connection surfaces are previews only. Nothing here calls an API placeholder or
 * reports a connection that does not exist.
 */
export function IntegrationCard({ name, description, monogram, status, statusTone = "neutral", actionLabel = "Connect", onAction, children, className }: IntegrationCardProps) {
  return <Card className={cn("flex h-full flex-col gap-4 p-[var(--card-padding)]", className)}>
    <div className="flex items-start gap-3">
      <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-md border border-border bg-surface-soft text-sm font-semibold text-text-secondary">{monogram}</span>
      <div className="min-w-0 flex-1">
        <h3 className="dovia-card-title">{name}</h3>
        <p className="mt-1 text-sm leading-relaxed text-text-secondary">{description}</p>
      </div>
    </div>
    {children}
    <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
      <Badge variant={statusTone}>{status}</Badge>
      <Button variant="outline" size="sm" onClick={onAction}>{actionLabel}</Button>
    </div>
  </Card>;
}
export default IntegrationCard;