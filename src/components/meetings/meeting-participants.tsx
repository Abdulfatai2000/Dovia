import type { Participant } from "@/types/meeting";
import { getUser } from "@/services/team.service";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
export default function MeetingParticipants({ participants }: { participants: Participant[] }) {
  return <Card className="space-y-5 p-5"><SectionHeader title="Participants" description={`${participants.length} people in this meeting`} />
    <ul className="space-y-4">{participants.map(p => { const user = getUser(p.userId); return <li key={p.userId} className="flex flex-wrap items-center gap-3"><Avatar name={user?.name ?? "Unknown participant"} size="sm" /><div className="min-w-0 flex-1"><p className="text-sm font-medium">{user?.name ?? "Unknown participant"}</p><p className="text-xs text-text-muted">{user?.role ?? "Team member"}</p></div>{p.organizer && <Badge variant="primary">Organizer</Badge>}</li>; })}</ul>
  </Card>;
}

