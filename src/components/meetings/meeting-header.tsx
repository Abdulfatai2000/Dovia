import { ArrowRight, CalendarDays, Video } from "lucide-react";
import type { Meeting } from "@/types/meeting";
import { PageHeader } from "@/components/ui/page-header";
import { ButtonLink } from "@/components/ui/button-link";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate, formatTime } from "@/lib/meeting-format";
export default function MeetingHeader({ meeting, onEdit }: { meeting: Meeting; onEdit: () => void }) {
  return <div className="space-y-4"><PageHeader title={meeting.title} eyebrow="Meeting workspace"
    breadcrumbs={<ButtonLink href="/meetings" variant="ghost" size="sm">← Back to Meetings</ButtonLink>}
    actions={<><Button variant="outline" onClick={onEdit}>Edit</Button><ButtonLink href={`/meetings/${meeting.id}/content`}>Start Meeting<ArrowRight aria-hidden="true" /></ButtonLink></>} />
    <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary"><StatusBadge status={meeting.status} />
      <span className="flex items-center gap-2"><CalendarDays aria-hidden="true" className="size-4" />{formatDate(meeting.date)} · {formatTime(meeting.startTime)} · {meeting.duration} min</span>
      <span className="flex items-center gap-2"><Video aria-hidden="true" className="size-4" />{meeting.platform}</span>
    </div>
    {meeting.meetingUrl && <p className="break-all text-xs text-text-muted">Demo meeting URL: {meeting.meetingUrl} (not connected)</p>}
  </div>;
}
