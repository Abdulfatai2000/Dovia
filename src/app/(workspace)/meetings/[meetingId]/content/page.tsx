import MeetingContentPage from "@/components/meetings/meeting-content-page";
export default async function Page({ params }: { params: Promise<{ meetingId: string }> }) {
  const { meetingId } = await params;
  return <MeetingContentPage meetingId={meetingId} />;
}
