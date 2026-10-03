import MeetingWorkspace from "@/components/meetings/meeting-workspace";
export default async function Page({ params, searchParams }: { params: Promise<{ meetingId: string }>; searchParams: Promise<{ created?: string }> }) {
  const { meetingId } = await params;
  const { created } = await searchParams;
  return <MeetingWorkspace key={meetingId} meetingId={meetingId} created={created === "1"} />;
}
