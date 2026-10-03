import { getMeetings } from "./meeting.service";
import { getTasks } from "./task.service";
import { getTeamMembers } from "./team.service";
import { getConfirmedOutcomes } from "./meeting-outcome.service";
import { taskHref } from "@/lib/task-utils";
export interface SearchResult {id:string;group:"Meetings"|"Tasks"|"People"|"Decisions";title:string;context:string;href:string;}
export function getSearchIndex():SearchResult[]{
 const meetings=getMeetings();
 return [...meetings.map(m=>({id:m.id,group:"Meetings" as const,title:m.title,context:`${m.team} · ${m.date}`,href:`/meetings/${m.id}`})),
 ...getTasks().map(t=>({id:t.id,group:"Tasks" as const,title:t.title,context:meetings.find(m=>m.id===t.meetingId)?.title||"Demo task",href:taskHref(t.id)})),
 ...getTeamMembers().map(u=>({id:u.id,group:"People" as const,title:u.name,context:`${u.role} · ${u.department}`,href:`/team/${u.id}`})),
 ...getConfirmedOutcomes().flatMap(o=>o.decisions.map(d=>({id:`${o.meetingId}:${d.id}`,group:"Decisions" as const,title:d.description,context:meetings.find(m=>m.id===o.meetingId)?.title||"Confirmed outcome",href:`/meetings/${o.meetingId}`})))];
}
