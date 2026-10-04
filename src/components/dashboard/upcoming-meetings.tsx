import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import type { Meeting } from "@/types/meeting";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Dropdown } from "@/components/ui/dropdown";
import { ButtonLink } from "@/components/ui/button-link";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { getUser } from "@/services/team.service";
import { formatDate, formatTime } from "@/lib/meeting-format";
export default function UpcomingMeetings({ meetings, loading = false }: { meetings: Meeting[]; loading?: boolean }) {
  if (loading) return <div role="status"><span className="sr-only">Loading meetings</span><Skeleton className="h-72" /></div>;
  if (!meetings.length) return <EmptyState title="No upcoming meetings" description="Create a meeting to get your team together." />;
return <Card><ul className="divide-y divide-border">{meetings.map(meeting => {
    const href = `/meetings/${meeting.id}`;
    return <li key={meeting.id} className="space-y-4 p-5 transition-colors duration-200 hover:bg-surface-soft/60">
      <div className="flex items-start gap-3"><div aria-hidden="true" className="dovia-accent-gradient flex size-12 shrink-0 flex-col items-center justify-center rounded-md text-on-brand shadow-sm"><span className="text-[10px] uppercase opacity-90">{formatDate(meeting.date).split(" ")[0]}</span><span className="text-lg font-semibold">{Number(meeting.date.slice(-2))}</span></div>
        <div className="min-w-0 flex-1"><h3 className="break-words text-sm font-semibold"><Link href={href} className="text-foreground">{meeting.title}</Link></h3><p className="mt-1 text-xs text-text-muted">{formatDate(meeting.date)} · {formatTime(meeting.startTime)}</p><p className="mt-1 text-xs text-text-secondary">{meeting.platform} · {meeting.duration} min</p></div>
        <Dropdown iconOnly variant="ghost" trigger={<MoreHorizontal />} label={`Actions for ${meeting.title}`} items={[{id:"view",label:"View meeting",href},{id:"content",label:"Add meeting content",href:href+"/content"}]} />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3"><div className="flex -space-x-2">{meeting.participants.slice(0,3).map(p => <Avatar key={p.userId} name={getUser(p.userId)?.name ?? "Participant"} size="sm" className="border-2 border-surface" />)}<span className="ml-3 self-center text-xs text-text-muted">{meeting.participants.length} people</span></div><ButtonLink href={href} variant="outline" size="sm" aria-label={`View ${meeting.title}`}>View meeting</ButtonLink></div>
    </li>;
  })}</ul></Card>;
}

