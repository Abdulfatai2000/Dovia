"use client";

import { Button } from "@/components/ui/button";

function GoogleMark() {
  return <span aria-hidden="true"
    className="flex size-4 shrink-0 items-center justify-center text-[0.9rem] leading-none font-bold">G</span>;
}

function MicrosoftMark() {
  return <span aria-hidden="true" className="grid size-4 shrink-0 grid-cols-2 gap-0.5">
    <span className="bg-current" />
    <span className="bg-current" />
    <span className="bg-current" />
    <span className="bg-current" />
  </span>;
}

export function AuthSocialButtons({ onGoogle, onMicrosoft }: { onGoogle: () => void; onMicrosoft: () => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-xs text-text-muted">
        <span aria-hidden="true" className="h-px flex-1 bg-border" />or continue with<span aria-hidden="true" className="h-px flex-1 bg-border" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Button variant="outline" onClick={onGoogle}><GoogleMark />Continue with Google</Button>
        <Button variant="outline" onClick={onMicrosoft}><MicrosoftMark />Continue with Microsoft</Button>
      </div>
    </div>
  );
}
