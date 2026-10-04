import Link from "next/link";
import { CalendarDays, Clock3, MoreHorizontal, Video } from "lucide-react";
import type { Meeting } from "@/types/meeting";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Avatar } from "@/components/ui/avatar";
import { Dropdown } from "@/components/ui/dropdown";
import { ButtonLink } from "@/components/ui/button-link";
import { getUser } from "@/services/team.service";
import { formatDate, formatTime } from "@/lib/meeting-format";

export default function MeetingCard({ meeting }: { meeting: Meeting }) {
  const href = `/meetings/${meeting.id}`;
  return <Card className="flex h-full flex-col gap-5 p-5">
    <div className="flex items-start justify-between gap-2">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-ai-soft text-ai"><CalendarDays aria-hidden="true" className="size-5" /></span>
      <StatusBadge status={meeting.status} />
      <Dropdown iconOnly variant="ghost" trigger={<MoreHorizontal />} label={`Actions for ${meeting.title}`}
        items={[{ id: "view", label: "View meeting", href }, { id: "content", label: "Add meeting content", href: href + "/content" }]} />
    </div>
    <div className="min-w-0"><h3 className="dovia-card-title"><Link href={href} className="text-foreground">{meeting.title}</Link></h3>
      <p className="mt-1 text-sm text-text-muted">{meeting.team || "No team"} · {meeting.meetingType}</p></div>
    <div className="space-y-2 text-sm text-text-secondary">
      <p className="flex items-start gap-2"><Clock3 aria-hidden="true" className="mt-0.5 size-4 shrink-0" />{formatDate(meeting.date)} · {formatTime(meeting.startTime)} · {meeting.duration} min</p>
      <p className="flex items-center gap-2"><Video aria-hidden="true" className="size-4 shrink-0" />{meeting.platform}</p>
    </div>
    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
      <div className="flex items-center -space-x-2" aria-label={`${meeting.participants.length} participants`}>
        {meeting.participants.slice(0, 3).map(p => <Avatar key={p.userId} size="sm" name={getUser(p.userId)?.name ?? "Unknown participant"} className="border-2 border-surface" />)}
        {meeting.participants.length > 3 && <span className="flex size-8 items-center justify-center rounded-pill border-2 border-surface bg-surface-soft text-xs text-text-secondary">+{meeting.participants.length - 3}</span>}
      </div>
      <ButtonLink href={href} variant="outline" size="sm" aria-label={`View ${meeting.title}`}>View meeting</ButtonLink>
    </div>
  </Card>;
}

