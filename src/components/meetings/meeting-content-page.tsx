"use client";

import { useMeetings } from "@/hooks/use-meetings";
import { PageHeader } from "@/components/ui/page-header";
import { ButtonLink } from "@/components/ui/button-link";
import { formatDate, formatTime } from "@/lib/meeting-format";
import ContentInput from "./content-input";
import { MeetingLoading, MeetingNotFound } from "./meeting-state";

export default function MeetingContentPage({ meetingId }: { meetingId: string }) {
  const { meetings, loading, error } = useMeetings();
  const meeting = meetings.find(item => item.id === meetingId);
  if (loading) return <MeetingLoading />;
  if (error || !meeting) return <MeetingNotFound error={error} />;
  return <div className="mx-auto max-w-5xl space-y-6">
    <PageHeader title="Add Meeting Content"
      description="Upload or paste your meeting notes, or type them manually to generate an AI summary."
      breadcrumbs={<ButtonLink href={`/meetings/${meeting.id}`} variant="ghost" size="sm">← Back to Meeting</ButtonLink>} />
    <p className="-mt-2 text-sm text-text-secondary">
      <span className="font-medium text-foreground">{meeting.title}</span>
      <span className="text-text-muted"> · {formatDate(meeting.date)} at {formatTime(meeting.startTime)}</span>
    </p>
    <ContentInput key={meetingId} meetingId={meetingId} />
  </div>;
}