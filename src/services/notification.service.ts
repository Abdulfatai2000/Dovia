import { allPages,apiFetch,changed } from "@/lib/api-client";
import type { DemoNotification,NotificationType } from "@/types/notification";
interface Record { _id:string; type:NotificationType;title:string;message:string;createdAt:string;readAt?:string;relatedMeetingId?:string;relatedTaskId?:string }
export async function getNotifications():Promise<DemoNotification[]> {
 return (await allPages<Record>("/api/notifications")).map(item=>({id:item._id,type:item.type,title:item.title,description:item.message,timestamp:item.createdAt,read:Boolean(item.readAt),category:item.type.startsWith("TASK_")?"Tasks":item.type.startsWith("MEETING_")?"Meetings":item.type==="MENTION"?"Mentions":"System",href:item.relatedTaskId?"/tasks/"+item.relatedTaskId:item.relatedMeetingId?"/meetings/"+item.relatedMeetingId:"/notifications",taskId:item.relatedTaskId,meetingId:item.relatedMeetingId}));
}
export async function setNotificationRead(id:string,read:boolean){await apiFetch("/api/notifications",{method:"PATCH",body:JSON.stringify({id,read})});changed();}
export async function markAllNotificationsRead(){await apiFetch("/api/notifications",{method:"PATCH",body:JSON.stringify({all:true,read:true})});changed();}
