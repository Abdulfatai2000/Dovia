import MeetingReview from "@/components/ai/meeting-review";
export default async function Page({ params }: { params: Promise<{ meetingId: string }> }) {
  const { meetingId } = await params;
  return <MeetingReview key={meetingId} meetingId={meetingId} />;
}
