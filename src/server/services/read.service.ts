import { Types } from "mongoose";
import { Meeting } from "../models/meeting";
import { Task } from "../models/task";
import { Activity } from "../models/activity";
import { Decision } from "../models/decision";
import { Workspace } from "../models/workspace";
import { workspaceMembers } from "../repositories/workspace.repository";
import { getMeeting } from "../repositories/meeting.repository";
import { listTasks } from "../repositories/task.repository";
import { date, invalid, objectId, pagination, searchPattern } from "../validation";
import type { WorkspaceContext } from "../workspace-session";
export async function activity(context: WorkspaceContext, query: URLSearchParams) {
 const { page, limit, skip } = pagination(query), filter: Record<string, unknown> = { workspaceId: context.workspaceId };
 for (const key of ["meetingId", "taskId", "actorId"]) if (query.has(key)) filter[key] = objectId(query.get(key), key);
 const [items,total] = await Promise.all([Activity.find(filter).sort({ createdAt:-1, _id:-1 }).skip(skip).limit(limit).lean(), Activity.countDocuments(filter)]);
 return { items, total, page, limit };
}
export async function taskStats(context: WorkspaceContext, extra: Record<string, unknown> = {}) {
 const now = new Date();
 const rows = await Task.aggregate([{ $match: { workspaceId: new Types.ObjectId(context.workspaceId), deletedAt: null, ...extra } }, { $group: { _id: null, total: { $sum: 1 }, completed: { $sum: { $cond: [{ $eq: ["$status", "COMPLETED"] }, 1, 0] } }, inProgress: { $sum: { $cond: [{ $eq: ["$status", "IN_PROGRESS"] }, 1, 0] } }, notStarted: { $sum: { $cond: [{ $eq: ["$status", "NOT_STARTED"] }, 1, 0] } }, blocked: { $sum: { $cond: [{ $eq: ["$status", "BLOCKED"] }, 1, 0] } }, overdue: { $sum: { $cond: [{ $and: [{ $ne: ["$status", "COMPLETED"] }, { $ne: [{ $ifNull: ["$dueDate", null] }, null] }, { $lt: ["$dueDate", now] }] }, 1, 0] } } } }]);
 const result = (rows[0] ?? { total: 0, completed: 0, inProgress: 0, notStarted: 0, blocked: 0, overdue: 0 }) as { total: number; completed: number; inProgress: number; notStarted: number; blocked: number; overdue: number };
 return { ...result, open: result.total - result.completed, completionRate: result.total ? Math.round(result.completed / result.total * 100) : 0 };
}
export async function followUp(context: WorkspaceContext, id: string, query: URLSearchParams) {
 await getMeeting(context,id); query.set("meetingId",id);
 const [stats,tasks,recentActivity] = await Promise.all([taskStats(context,{meetingId:new Types.ObjectId(id)}), listTasks(context,query), activity(context,new URLSearchParams({meetingId:id,limit:"25"}))]);
 return {meetingId:id,totalTasks:stats.total,...stats,tasks:tasks.items,pagination:{total:tasks.total,page:tasks.page,limit:tasks.limit},recentActivity:recentActivity.items};
}
export async function dashboard(context: WorkspaceContext) {
 const [upcomingCount,upcomingMeetings,stats,myTasks,overdueTasks,completedTasks,recentActivity,workspace,members] = await Promise.all([
  Meeting.countDocuments({workspaceId:context.workspaceId,deletedAt:null,scheduledAt:{$gte:new Date()},status:{$in:["SCHEDULED","DRAFT"]}}),
  Meeting.find({workspaceId:context.workspaceId,deletedAt:null,scheduledAt:{$gte:new Date()},status:{$in:["SCHEDULED","DRAFT"]}}).sort({scheduledAt:1}).limit(6).lean(),taskStats(context),
  listTasks(context,new URLSearchParams({assigneeId:context.userId,limit:"10"})),listTasks(context,new URLSearchParams({status:"OVERDUE",limit:"10"})),listTasks(context,new URLSearchParams({status:"COMPLETED",limit:"10"})),activity(context,new URLSearchParams({limit:"10"})),Workspace.findOne({_id:context.workspaceId}).select("name").lean(),workspaceMembers(context)]);
 return {upcomingCount,upcomingMeetings,taskStats:stats,myTasks:myTasks.items,overdueTasks:overdueTasks.items,completedTasks:completedTasks.items,recentActivity:recentActivity.items,currentUser:members.find(member=>member.id===context.userId),workspace};
}
export function dateWindow(query: URLSearchParams) {
 const now = new Date(), from = query.has("from") ? date(query.get("from"),"from") : new Date(now.getTime()-29*86400000), to = query.has("to") ? date(query.get("to"),"to") : now;
 if (query.get("to")?.length===10) to.setUTCHours(23,59,59,999);
 if (from>to || to.getTime()-from.getTime()>366*86400000) invalid("date range (maximum 366 days)"); return {from,to};
}
export async function calendar(context:WorkspaceContext,query:URLSearchParams) {
 const {from,to}=dateWindow(query), filter={workspaceId:context.workspaceId,deletedAt:null};
 const [meetings,taskDeadlines]=await Promise.all([Meeting.find({...filter,scheduledAt:{$gte:from,$lte:to}}).sort({scheduledAt:1}).limit(100).lean(),Task.find({...filter,dueDate:{$gte:from,$lte:to}}).sort({dueDate:1}).limit(100).lean()]);
 return {meetings,taskDeadlines};
}
export async function search(context:WorkspaceContext,query:URLSearchParams) {
 const q=query.get("q")?.trim()??""; if(!q)return {query:q,groups:[],total:0};
 const pattern={$regex:searchPattern(q),$options:"i"},filter={workspaceId:context.workspaceId,deletedAt:null};
 const [meetings,tasks,members,decisions]=await Promise.all([Meeting.find({...filter,title:pattern}).select("title").limit(8).lean(),Task.find({...filter,title:pattern}).select("title").limit(8).lean(),workspaceMembers(context),Decision.find({workspaceId:context.workspaceId,text:pattern}).select("text meetingId").limit(8).lean()]);
 const groups=[{group:"Meetings",results:meetings.map(m=>({id:String(m._id),group:"Meetings",title:m.title,context:"Meeting",href:"/meetings/"+m._id}))},{group:"Tasks",results:tasks.map(t=>({id:String(t._id),group:"Tasks",title:t.title,context:"Task",href:"/tasks/"+t._id}))},{group:"People",results:members.filter(m=>(m.name+" "+m.email).toLowerCase().includes(q.toLowerCase())).slice(0,8).map(m=>({id:m.id,group:"People",title:m.name,context:m.role,href:"/team/"+m.id}))},{group:"Decisions",results:decisions.map(d=>({id:String(d._id),group:"Decisions",title:d.text,context:"Confirmed decision",href:"/meetings/"+d.meetingId}))}].filter(g=>g.results.length);
 return {query:q,groups,total:groups.reduce((sum,g)=>sum+g.results.length,0)};
}
