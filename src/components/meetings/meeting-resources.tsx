"use client";

import { useCallback } from "react";
import { useDemoQuery } from "@/hooks/use-demo-query";
import { getMeeting, getMeetingContent } from "@/services/meeting.service";
import { PageHeader } from "@/components/ui/page-header";
import { ButtonLink } from "@/components/ui/button-link";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { MeetingLoading, MeetingNotFound } from "./meeting-state";
import MeetingFiles from "./meeting-files";

export default function MeetingResources({ meetingId, kind }: { meetingId: string; kind: "transcript" | "files" }) {
  const load = useCallback(() => ({ meeting: getMeeting(meetingId), content: getMeetingContent(meetingId) }), [meetingId]);
  const { data, loading, error } = useDemoQuery(load);
  if (loading) return <MeetingLoading />;
  if (error || !data?.meeting) return <MeetingNotFound error={error} />;
  const { meeting, content } = data;
  const files = [...meeting.files, ...(content?.file && !meeting.files.some(file => file.id === content.file?.id) ? [content.file] : [])];
  return <div className="min-w-0 space-y-6">
    <PageHeader title={kind === "files" ? "Meeting files" : "Meeting notes & transcript"} description={meeting.title}
      breadcrumbs={<ButtonLink href={`/meetings/${meetingId}`} variant="ghost" size="sm">Back to Meeting</ButtonLink>} />
    {kind === "files" ? <MeetingFiles files={files} /> : content?.text.trim() ?
      <Card className="space-y-4 p-[var(--card-padding)]"><h2 className="dovia-card-title">Saved meeting content</h2>
        <p className="text-xs text-text-muted">Browser-local notes. No automatic transcription is connected.</p>
        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{content.text}</p></Card> :
      <EmptyState title="No transcript or notes yet" description="Add meeting content to keep a local demo record. Uploaded document references do not include extracted text."
        action={<ButtonLink href={`/meetings/${meetingId}/content`}>Add Meeting Content</ButtonLink>} />}
  </div>;
}
