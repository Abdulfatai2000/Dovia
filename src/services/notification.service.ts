import { seedNotifications } from "@/data/mock/notifications";
import { DEMO_TODAY } from "@/data/mock/meetings";
import { CURRENT_USER_ID,isTaskOverdue,shiftDay,taskHref } from "@/lib/task-utils";
import { readDemo,writeDemo,isRecord } from "@/lib/demo-store";
import { getTasks } from "./task.service";
import { getMeetings } from "./meeting.service";
import { getConfirmedOutcomes } from "./meeting-outcome.service";
import type { DemoNotification,NotificationType } from "@/types/notification";
const KEY="dovia_demo_notification_read";
const readState=()=>readDemo<Record<string,boolean>>(KEY,{},(v):v is Record<string,boolean>=>isRecord(v)&&Object.values(v).every(item=>typeof item==="boolean"));
export function getNotifications():DemoNotification[]{
 const state=readState(),meetings=getMeetings(),tasks=getTasks(),outcomes=getConfirmedOutcomes();
 const result:Omit<DemoNotification,"read">[]=[...seedNotifications];
 const add=(type:NotificationType,id:string,title:string,description:string,timestamp:string,href:string,taskId?:string,meetingId?:string)=>result.push({id:`${type}:${id}`,type,category:type.startsWith("TASK_")?"Tasks":"Meetings",title,description,timestamp,href,taskId,meetingId});
 for(const task of tasks.filter(t=>t.assigneeId===CURRENT_USER_ID)){
   const source=meetings.find(m=>m.id===task.meetingId);const text=`${task.title}${source?` · From ${source.title}`:""}`;const date=task.updatedAt||task.createdAt||"2026-10-05T08:30:00Z";
   add("TASK_ASSIGNED",task.id,"Task assigned to you",text,task.createdAt||date,taskHref(task.id),task.id,task.meetingId);
   if(task.status==="COMPLETED")add("TASK_COMPLETED",task.id,"Task completed",text,task.completedAt||date,taskHref(task.id),task.id,task.meetingId);
   else if(isTaskOverdue(task))add("TASK_OVERDUE",task.id,"Task overdue",text,date,taskHref(task.id),task.id,task.meetingId);
   else if(task.dueDate&&task.dueDate>=DEMO_TODAY&&task.dueDate<=shiftDay(DEMO_TODAY,2))add("TASK_DUE_SOON",task.id,"Task due soon",`${text} · Due ${task.dueDate}`,date,taskHref(task.id),task.id,task.meetingId);
 }
 for(const meeting of meetings){
   const href=`/meetings/${meeting.id}`;
   if(meeting.status==="SCHEDULED"&&meeting.date===DEMO_TODAY)add("MEETING_REMINDER",meeting.id,"Meeting reminder",`${meeting.title} · ${meeting.startTime??"Time not set"} on the demo calendar.`,`${meeting.date}T08:00:00Z`,href,undefined,meeting.id);
   if(meeting.id.startsWith("demo-"))add("MEETING_CREATED",meeting.id,"Meeting created for demo",meeting.title,meeting.createdAt||`${meeting.date}T08:00:00Z`,href,undefined,meeting.id);
   if(meeting.status==="REVIEW")add("MEETING_SUMMARY_READY",meeting.id,"Mock meeting summary ready",`${meeting.title} · Review the illustrative draft before confirming.`,`${meeting.date}T12:00:00Z`,href+"/ai-review",undefined,meeting.id);
 }
 for(const outcome of outcomes){const meeting=meetings.find(m=>m.id===outcome.meetingId);if(meeting)add("MEETING_CONFIRMED",meeting.id,"Meeting outcome confirmed",`${meeting.title} · View follow-up action items.`,outcome.confirmedAt||`${meeting.date}T12:00:00Z`,`/meetings/${meeting.id}/follow-up`,undefined,meeting.id);}
 return result.map(item=>({...item,read:state[item.id]??false})).sort((a,b)=>b.timestamp.localeCompare(a.timestamp));
}
export function setNotificationRead(id:string,read:boolean){writeDemo(KEY,{...readState(),[id]:read});}
export function markAllNotificationsRead(){const state=readState();getNotifications().forEach(item=>{state[item.id]=true;});writeDemo(KEY,state);}
