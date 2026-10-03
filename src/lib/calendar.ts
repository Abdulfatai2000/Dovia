import type { Meeting } from "@/types/meeting";
import type { Task } from "@/types/task";
import { taskHref } from "./task-utils";
export interface CalendarEntry {id:string;title:string;date:string;time?:string;kind:"Meeting"|"Task deadline"|"Follow-up";href:string;completed:boolean;}
export function calendarEntries(meetings:Meeting[],tasks:Task[]):CalendarEntry[] {
  return [...meetings.filter(m=>m.status!=="CANCELLED"&&m.status!=="DRAFT").map(m=>({id:m.id,title:m.title,date:m.date,time:m.startTime,kind:"Meeting" as const,href:`/meetings/${m.id}`,completed:m.status==="COMPLETED"})),
    ...tasks.filter(t=>t.dueDate).map(t=>({id:t.id,title:t.title,date:t.dueDate!,time:undefined,kind:t.meetingId&&t.status!=="COMPLETED"?"Follow-up" as const:"Task deadline" as const,href:taskHref(t.id),completed:t.status==="COMPLETED"}))]
    .sort((a,b)=>(a.date+(a.time??"99:99")).localeCompare(b.date+(b.time??"99:99"))||a.title.localeCompare(b.title));
}

