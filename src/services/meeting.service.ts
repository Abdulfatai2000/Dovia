import { allPages, apiFetch, changed } from "@/lib/api-client";
import { meetingDto, type MeetingRecord } from "@/lib/api-adapters";
import type { CreateMeetingInput, MeetingContent } from "@/types/meeting";
export async function getMeetings() { return (await allPages<MeetingRecord>("/api/meetings")).map(meetingDto); }
export async function getMeeting(id:string) { return meetingDto(await apiFetch<MeetingRecord>("/api/meetings/"+id)); }
export async function createMeeting(input:CreateMeetingInput) {
 const platforms:Record<string,string>={"Google Meet":"GOOGLE_MEET","Microsoft Teams":"MICROSOFT_TEAMS","Zoom":"ZOOM","In Person":"IN_PERSON","In-person":"IN_PERSON"};
 const body={title:input.title,description:input.description,scheduledAt:new Date(input.date+"T"+(input.startTime||"09:00")).toISOString(),durationMinutes:input.duration??45,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,platform:platforms[input.platform]??"OTHER",meetingType:"STANDARD",projectName:input.team,participantIds:input.participants.map(p=>p.userId),agenda:input.agenda,recurring:input.recurring??false};
 const meeting=meetingDto(await apiFetch<MeetingRecord>("/api/meetings",{method:"POST",body:JSON.stringify(body)}));changed();return meeting;
}
export async function saveMeetingContent(id:string,content:MeetingContent) {
 await apiFetch("/api/meetings/"+id+"/content",{method:"POST",body:JSON.stringify({contentType:content.mode==="upload"?"FILE":content.mode==="manual"?"MANUAL_NOTES":"PASTED_NOTES",rawText:content.text,files:content.file?[{name:content.file.name,mimeType:content.file.type,size:content.file.size??0}]:[]})});changed();
}
export async function getMeetingContent(id:string):Promise<MeetingContent|null> {
 const saved=await apiFetch<{contentType:string;rawText?:string;files:{name:string;mimeType:string;size:number}[]}|null>("/api/meetings/"+id+"/content");
 return saved?{mode:saved.contentType==="FILE"?"upload":saved.contentType==="MANUAL_NOTES"?"manual":"paste",text:saved.rawText??"",file:saved.files[0]?{id:"saved-file",name:saved.files[0].name,type:saved.files[0].mimeType,size:saved.files[0].size}:undefined}:null;
}
