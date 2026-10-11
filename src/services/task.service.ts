import { allPages, apiFetch, changed, WORKSPACE_CHANGED } from "@/lib/api-client";
import { taskDto, activityDto, type TaskRecord, type ActivityRecord } from "@/lib/api-adapters";
import { summarizeTasks } from "@/lib/task-utils";
import type { Task, TaskInput, TaskChanges } from "@/types/task";
export const TASKS_CHANGED=WORKSPACE_CHANGED;
export async function getTasks(){return (await allPages<TaskRecord>("/api/tasks")).map(taskDto);}
export async function getTask(id:string){return taskDto(await apiFetch<TaskRecord>("/api/tasks/"+id));}
export async function getTasksForMeeting(id:string){return (await allPages<TaskRecord>("/api/tasks?meetingId="+id)).map(taskDto);}
export async function getTasksForUser(id:string){return (await allPages<TaskRecord>("/api/tasks?assigneeId="+id)).map(taskDto);}
export const getTaskStats=(tasks:Task[])=>summarizeTasks(tasks);
export async function getTaskActivity(){return (await allPages<ActivityRecord>("/api/activity")).map(activityDto);}
export async function createTask(input:TaskInput){const task=taskDto(await apiFetch<TaskRecord>("/api/tasks",{method:"POST",body:JSON.stringify(input)}));changed();return task;}
export async function updateTask(id:string,input:TaskChanges){const task=taskDto(await apiFetch<TaskRecord>("/api/tasks/"+id,{method:"PATCH",body:JSON.stringify(input)}));changed();return task;}
