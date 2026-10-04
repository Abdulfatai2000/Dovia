import MeetingResources from "@/components/meetings/meeting-resources";
export default async function Page({ params }: { params: Promise<{ meetingId: string }> }) {
  const { meetingId } = await params;
  return <MeetingResources meetingId={meetingId} kind="transcript" />;
}
