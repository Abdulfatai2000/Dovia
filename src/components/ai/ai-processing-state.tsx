import { CircleCheck, CircleAlert, LoaderCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export const aiProcessingSteps = ["Preparing transcript", "Analyzing discussion", "Identifying decisions", "Extracting action items", "Finding open questions", "Finalizing summary"] as const;
export interface AIProcessingStateProps {
  state: "idle" | "processing" | "success" | "error";
  /** Zero-based current step, supplied by the caller. No timers or requests are started. */
  step?: number;
  errorMessage?: string;
  className?: string;
}
export function AIProcessingState({ state, step = 0, errorMessage = "Unable to analyze this content. Please try again.", className }: AIProcessingStateProps) {
  const current = Number.isFinite(step) ? Math.max(0, Math.min(aiProcessingSteps.length - 1, Math.floor(step))) : 0;
  const Icon = state === "processing" ? LoaderCircle : state === "success" ? CircleCheck : state === "error" ? CircleAlert : Sparkles;
  const title = state === "processing" ? aiProcessingSteps[current] : state === "success" ? "Analysis ready for review" : state === "error" ? "Analysis could not be completed" : "Ready to analyze";
  return <div className={cn("space-y-5 rounded-lg border border-border bg-ai-soft p-[var(--card-padding)]", className)}>
    <div role={state === "error" ? "alert" : "status"} aria-atomic="true" className="flex items-start gap-3">
      <Icon aria-hidden="true" className={cn("mt-0.5 size-5 shrink-0 text-ai", state === "processing" && "dovia-spinner")} />
      <div className="min-w-0 space-y-1"><h3 className="font-medium text-foreground">{title}</h3><p className="text-sm text-text-secondary">{state === "error" ? errorMessage : state === "success" ? "Review and confirm this draft before creating final tasks." : state === "idle" ? "Turn your meeting notes into a draft for human review." : "AI suggestions will be a draft for your review."}</p></div>
    </div>
    {state === "processing" && <ol aria-label="Analysis stages" className="grid gap-3 sm:grid-cols-2">
      {aiProcessingSteps.map((label, index) => <li key={label} aria-current={index === current ? "step" : undefined} className={cn("flex items-center gap-2 text-sm", index === current ? "font-medium text-ai" : "text-text-secondary")}>
        <span aria-hidden="true" className="flex size-6 shrink-0 items-center justify-center rounded-pill bg-surface text-xs">{index < current ? <CircleCheck className="size-4 text-ai" /> : index + 1}</span>
        <span>{label}<span className="sr-only">{index < current ? " — Complete" : index === current ? " — In progress" : " — Pending"}</span></span>
      </li>)}
    </ol>}
  </div>;
}
export default AIProcessingState;
