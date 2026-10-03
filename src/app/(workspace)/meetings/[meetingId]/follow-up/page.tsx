import FollowUpProgress from "@/components/meetings/follow-up-progress";
export default async function Page({params}:{params:Promise<{meetingId:string}>}){const {meetingId}=await params;return <FollowUpProgress key={meetingId} meetingId={meetingId} />;}
