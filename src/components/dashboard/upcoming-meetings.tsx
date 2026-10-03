import type { Meeting } from "@/types/meeting";
import MeetingCard from "@/components/meetings/meeting-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
export default function UpcomingMeetings({ meetings, loading = false }: { meetings: Meeting[]; loading?: boolean }) {
  if (loading) return <div role="status"><span className="sr-only">Loading meetings</span><Skeleton className="h-72" /></div>;
  if (!meetings.length) return <EmptyState title="No upcoming meetings" description="Create a meeting to get your team together." />;
  return <div className="grid gap-4">{meetings.map(meeting => <MeetingCard key={meeting.id} meeting={meeting} />)}</div>;
}
