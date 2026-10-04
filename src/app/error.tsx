"use client";

import Link from "next/link";
import { CircleAlert } from "lucide-react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-16 text-center">
    <span aria-hidden="true" className="mb-6 flex size-12 items-center justify-center rounded-lg bg-danger-soft text-danger-foreground"><CircleAlert className="size-6" /></span>
    <h1 className="dovia-page-title">This view could not be shown</h1>
    <p className="mt-3 max-w-md text-sm leading-relaxed text-text-secondary" role="alert">
      Something in this frontend preview failed to render. No data was sent anywhere and your saved demo data is untouched. Reload the view to try again.
    </p>
    {error.digest && <p className="mt-2 text-xs text-text-muted">Reference: {error.digest}</p>}
    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
      <button type="button" onClick={reset} className="inline-flex min-h-11 items-center justify-center rounded-default bg-primary px-4 py-2 text-sm font-medium text-on-brand transition-colors duration-200 hover:bg-primary-hover">Try again</button>
      <Link href="/dashboard" className="inline-flex min-h-11 items-center justify-center rounded-default border border-border-strong bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-surface-soft hover:no-underline">Back to Dashboard</Link>
    </div>
  </main>;
}