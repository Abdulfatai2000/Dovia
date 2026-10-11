import { Meeting } from "../models/meeting";
import { Task } from "../models/task";
import { ApiError } from "../api";
import { dateWindow } from "./read.service";
import { workspaceMembers } from "../repositories/workspace.repository";
import { choice } from "../validation";
import { calculateReport, reportRanges } from "@/lib/report-calculations";
import { meetingDto, taskDto, type MeetingRecord, type TaskRecord } from "@/lib/api-adapters";
import type { WorkspaceContext } from "../workspace-session";
export async function report(context:WorkspaceContext,query:URLSearchParams){
 const range=choice(query.get("range")??"Last 30 Days",reportRanges,"range"),{from,to}=dateWindow(query),filter={workspaceId:context.workspaceId,deletedAt:null};
 const meetings=await Meeting.find({...filter,scheduledAt:{$gte:from,$lte:to}}).limit(1001).lean();
 const tasks=await Task.find({...filter,$or:[{meetingId:{$in:meetings.map(m=>m._id)}},{createdAt:{$gte:from,$lte:to}},{completedAt:{$gte:from,$lte:to}}]}).limit(1001).lean();
 if(meetings.length>1000||tasks.length>1000)throw new ApiError(400,"RANGE_TOO_LARGE","Choose a smaller report period (maximum 1,000 records per domain).");
 const members=await workspaceMembers(context);
 return calculateReport(range,JSON.parse(JSON.stringify(meetings)).map((m:MeetingRecord)=>meetingDto(m)),JSON.parse(JSON.stringify(tasks)).map((t:TaskRecord)=>taskDto(t)),members,{start:from.toISOString().slice(0,10),end:to.toISOString().slice(0,10)});
}
