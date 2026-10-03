import { DEMO_TODAY } from "@/data/mock/meetings";
import { getMeetings } from "./meeting.service";
import { getTasks } from "./task.service";
import { getTeamMembers } from "./team.service";
import { shiftDay,dateKey,isTaskOverdue,summarizeTasks } from "@/lib/task-utils";
export const reportRanges=["Last 7 Days","Last 30 Days","Last 90 Days","This Month","Previous Month"] as const;
export type ReportRange=typeof reportRanges[number];
export function getReport(range:ReportRange){
 const now=new Date(DEMO_TODAY+"T12:00:00Z");let end=DEMO_TODAY;let start=shiftDay(end,-(range==="Last 7 Days"?6:range==="Last 90 Days"?89:29));
 if(range==="This Month")start=end.slice(0,7)+"-01";
 if(range==="Previous Month"){start=dateKey(new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth()-1,1,12)));end=shiftDay(DEMO_TODAY.slice(0,7)+"-01",-1);}
 const within=(date?:string)=>Boolean(date&&date.slice(0,10)>=start&&date.slice(0,10)<=end);
 const allMeetings=getMeetings(),allTasks=getTasks();
 const meetings=allMeetings.filter(m=>within(m.date));
 const held=meetings.filter(m=>["COMPLETED","REVIEW","PROCESSING"].includes(m.status));
 const tasks=allTasks.filter(t=>within(t.createdAt));
 const completed=allTasks.filter(t=>t.status==="COMPLETED"&&within(t.completedAt));
 const linked=tasks.filter(t=>t.meetingId);const done=linked.filter(t=>t.status==="COMPLETED").length;
 const buckets=[];for(let day=start;day<=end;day=shiftDay(day,7)){const last=shiftDay(day,6)>end?end:shiftDay(day,6);buckets.push({label:`${day.slice(5)} – ${last.slice(5)}`,count:held.filter(m=>m.date>=day&&m.date<=last).length});}
 const followUp=meetings.map(meeting=>({meeting,tasks:allTasks.filter(t=>t.meetingId===meeting.id)})).map(item=>({...item,stats:summarizeTasks(item.tasks)}));
 const overdue=tasks.filter(isTaskOverdue);const needing=followUp.filter(item=>item.stats.open>0).length;
 return {start,end,meetings,held,tasks,completed,overdue,linked,done,buckets,followUp,
   workload:getTeamMembers().map(user=>({user,stats:summarizeTasks(tasks.filter(t=>t.assigneeId===user.id))})),
   insights:[`${overdue.length} tasks in this creation cohort are overdue across ${new Set(overdue.map(t=>t.meetingId).filter(Boolean)).size} linked meetings.`,`${needing} meetings in the selected period still have unfinished follow-up work.`,`${completed.length} tasks were completed during the selected period.`],
   undated:allTasks.filter(t=>!t.createdAt).length};
}
