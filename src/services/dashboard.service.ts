import { apiFetch } from "@/lib/api-client";
import { meetingDto,taskDto,activityDto,type MeetingRecord,type TaskRecord,type ActivityRecord } from "@/lib/api-adapters";
import type { DemoUser } from "@/data/mock/users";
interface DashboardRecord {upcomingCount:number;upcomingMeetings:MeetingRecord[];myTasks:TaskRecord[];overdueTasks:TaskRecord[];completedTasks:TaskRecord[];recentActivity:ActivityRecord[];taskStats:{total:number;completed:number;open:number;overdue:number};currentUser:DemoUser;workspace:{name:string}}
export async function getDashboard(){const data=await apiFetch<DashboardRecord>("/api/dashboard");return {...data,upcomingMeetings:data.upcomingMeetings.map(meetingDto),myTasks:data.myTasks.map(taskDto),recentActivity:data.recentActivity.map(activityDto)};}
