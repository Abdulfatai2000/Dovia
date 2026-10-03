import MemberDetail from "@/components/team/member-detail";
export default async function Page({params}:{params:Promise<{memberId:string}>}){const {memberId}=await params;return <MemberDetail key={memberId} memberId={memberId} />;}
