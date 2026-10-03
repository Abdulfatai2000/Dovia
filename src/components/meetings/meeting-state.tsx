import { CalendarDays } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { ButtonLink } from "@/components/ui/button-link";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/ui/page-header";

export function MeetingLoading() {
  return <div role="status" className="space-y-6"><span className="sr-only">Loading demo meetings…</span>
    <Skeleton className="h-12 w-2/3" /><Skeleton className="h-24" /><Skeleton className="h-64" /></div>;
}
export function MeetingNotFound({ error }: { error?: string }) {
  return <div className="space-y-6"><PageHeader title={error ? "Unable to load meetings" : "Meeting not found"} />
    <EmptyState icon={<CalendarDays />} title={error ? "Demo storage unavailable" : "No matching meeting"}
      description={error || "The requested meeting could not be found in the demo dataset."}
      action={<ButtonLink href="/meetings">Back to Meetings</ButtonLink>} /></div>;
}
