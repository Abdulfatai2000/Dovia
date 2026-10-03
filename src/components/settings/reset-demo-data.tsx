"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { Toast } from "@/components/ui/toast";
import { resetDemoData } from "@/lib/demo-store";

/** Clears only `dovia_demo_` keys. Never calls localStorage.clear(). */
export default function ResetDemoData() {
  const [confirming, setConfirming] = useState(false);
  const [feedback, setFeedback] = useState<{ variant: "success" | "error"; title: string; description: string } | null>(null);

  function reset() {
    try {
      resetDemoData();
      setConfirming(false);
      setFeedback({ variant: "success", title: "Dovia demo data reset.", description: "Meetings, tasks, notifications, and settings are back to their defaults." });
    } catch (cause) {
      setConfirming(false);
      setFeedback({ variant: "error", title: "Demo data was not reset.", description: cause instanceof Error ? cause.message : "Unable to clear demo data in this browser." });
    }
  }

  return <>
    <Card className="p-[var(--card-padding)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <h2 className="dovia-card-title">Reset Demo Data</h2>
          <p className="max-w-xl text-sm leading-relaxed text-text-secondary">
            This will clear locally stored Dovia demo meetings, tasks, notifications, and settings on this browser,
            then restore the seed demo state.
          </p>
        </div>
        <Button variant="outline" onClick={() => setConfirming(true)}>
          <RotateCcw aria-hidden="true" />Reset Demo Data
        </Button>
      </div>
    </Card>

    <Modal open={confirming} onClose={() => setConfirming(false)} title="Reset demo data?"
      description="This will clear locally stored Dovia demo meetings, tasks, notifications, and settings on this browser."
      confirmLabel="Reset demo data" confirmVariant="danger" onConfirm={reset}>
      <p className="text-sm leading-relaxed text-text-secondary">
        Only Dovia demo keys are removed. Other data stored by this site is left untouched, and the seed demo state is restored.
        This cannot be undone.
      </p>
    </Modal>

    {feedback && <div className="fixed right-4 bottom-4 left-4 z-[var(--z-toast)] sm:left-auto">
      <Toast variant={feedback.variant} title={feedback.title} description={feedback.description} onDismiss={() => setFeedback(null)} />
    </div>}
  </>;
}