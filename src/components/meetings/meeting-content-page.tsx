"use client";
import { useMeetings } from "@/hooks/use-meetings";
import { PageHeader } from "@/components/ui/page-header";
import { ButtonLink } from "@/components/ui/button-link";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/meeting-format";
import ContentInput from "./content-input";
import { MeetingLoading, MeetingNotFound } from "./meeting-state";
export default function MeetingContentPage({ meetingId }: { meetingId: string }) {
  const { meetings, loading, error } = useMeetings();
  const meeting = meetings.find(m => m.id === meetingId);
  if (loading) return <MeetingLoading />;
  if (error || !meeting) return <MeetingNotFound error={error} />;
  return <div className="mx-auto max-w-5xl space-y-6">
    <PageHeader title="Add Meeting Content" description="Upload or paste your meeting notes, transcript, or write them directly before generating a meeting analysis."
      breadcrumbs={<ButtonLink href={`/meetings/${meeting.id}`} variant="ghost" size="sm">← Back to meeting</ButtonLink>} />
    <Card className="flex flex-wrap gap-x-8 gap-y-3 p-5"><div className="min-w-0"><p className="text-xs text-text-muted">Meeting</p><p className="break-words text-sm font-medium">{meeting.title}</p></div><div><p className="text-xs text-text-muted">Date</p><p className="text-sm">{formatDate(meeting.date)}</p></div><div><p className="text-xs text-text-muted">Participants</p><p className="text-sm">{meeting.participants.length}</p></div></Card>
    <ContentInput key={meetingId} meetingId={meetingId} />
  </div>;
}
