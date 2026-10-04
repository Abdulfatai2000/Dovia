"use client";

import { PageHeader } from "@/components/ui/page-header";
import { ButtonLink } from "@/components/ui/button-link";
import { ErrorState } from "@/components/ui/error-state";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <div className="space-y-6">
    <PageHeader title="This meeting could not be shown" breadcrumbs={<ButtonLink href="/meetings" variant="ghost" size="sm">← Back to Meetings</ButtonLink>} />
    <ErrorState title="Meeting view unavailable"
      description="Something in this frontend preview failed to render. No content was sent anywhere and your saved demo data is untouched."
      onRetry={reset} retryLabel="Try again" />
    <p className="text-xs text-text-muted">{error.digest ? `Reference: ${error.digest}. ` : ""}Reset demo data in Settings if this meeting keeps failing to load.</p>
  </div>;
}