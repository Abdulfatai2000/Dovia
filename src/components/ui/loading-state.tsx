import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LoadingStateProps { label?: string; className?: string; }
export function LoadingState({ label = "Loading...", className }: LoadingStateProps) {
  return <div role="status" aria-live="polite" className={cn("flex items-center justify-center gap-3 p-6 text-sm text-text-muted", className)}>
    <LoaderCircle aria-hidden="true" className="dovia-spinner size-5 shrink-0 text-primary" /><span>{label}</span>
  </div>;
}
