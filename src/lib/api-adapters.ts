import type { Meeting } from "@/types/meeting";
import type { Task, TaskActivity } from "@/types/task";
export interface MeetingRecord { _id:string; title:string; description?:string; scheduledAt:string; durationMinutes:number; status:Meeting["status"]; meetingType:string; platform:string; teamId?:string; projectName?:string; organizerId:string; participantIds:string[]; agenda:Meeting["agenda"]; externalMeetingUrl?:string; recurring?:boolean }
export interface TaskRecord extends Omit<Task,"id"> { _id:string }
export interface ActivityRecord { _id:string; taskId?:string; meetingId?:string; actorId:string; type:string; createdAt:string }
export function meetingDto(record:MeetingRecord):Meeting {
 const at=new Date(record.scheduledAt), pad=(n:number)=>String(n).padStart(2,"0");
 return {id:record._id,title:record.title,description:record.description,date:at.getFullYear()+"-"+pad(at.getMonth()+1)+"-"+pad(at.getDate()),startTime:pad(at.getHours())+":"+pad(at.getMinutes()),duration:record.durationMinutes,status:record.status,meetingType:record.meetingType,platform:record.platform,team:record.projectName??"",participants:record.participantIds.map(userId=>({userId,organizer:userId===record.organizerId})),agenda:record.agenda??[],files:[],carryOver:[],meetingUrl:record.externalMeetingUrl,recurring:record.recurring};
}
export function taskDto(record:TaskRecord):Task { return {...record,id:record._id,dueDate:record.dueDate?.slice(0,10)}; }
export function activityDto(record:ActivityRecord):TaskActivity {return {id:record._id,taskId:record.taskId??"",actorId:record.actorId,message:record.type.toLowerCase().replaceAll("_"," "),timestamp:record.createdAt};}
