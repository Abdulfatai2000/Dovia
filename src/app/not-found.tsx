import type { Metadata } from "next";
import Link from "next/link";
import { Compass } from "lucide-react";

export const metadata: Metadata = { title: "Page not found | Dovia" };

export default function NotFound() {
  return <main className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-16 text-center">
    <span aria-hidden="true" className="dovia-gradient mb-6 flex size-12 items-center justify-center rounded-lg text-on-brand"><Compass className="size-6" /></span>
    <h1 className="dovia-page-title">Page not found</h1>
    <p className="mt-3 max-w-md text-sm leading-relaxed text-text-secondary">
      This address does not match a Dovia page. It may have moved, or the link may be incomplete. Nothing in your demo data was changed.
    </p>
    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
      <Link href="/" className="inline-flex min-h-11 items-center justify-center rounded-default bg-primary px-4 py-2 text-sm font-medium text-on-brand transition-colors duration-200 hover:bg-primary-hover hover:no-underline">Return to Dovia</Link>
      <Link href="/dashboard" className="inline-flex min-h-11 items-center justify-center rounded-default border border-border-strong bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-surface-soft hover:no-underline">Open the demo workspace</Link>
    </div>
  </main>;
}