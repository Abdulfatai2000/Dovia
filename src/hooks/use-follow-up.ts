"use client";
import { useCallback } from "react";
import { apiFetch } from "@/lib/api-client";
import { taskDto,activityDto,type TaskRecord,type ActivityRecord } from "@/lib/api-adapters";
import { useDemoQuery } from "./use-demo-query";
interface FollowUp {total:number;completed:number;inProgress:number;overdue:number;blocked:number;tasks:TaskRecord[];recentActivity:ActivityRecord[];pagination:{total:number;page:number;limit:number}}
export function useFollowUp(id:string){const load=useCallback(async()=>{const data=await apiFetch<FollowUp>("/api/meetings/"+id+"/follow-up?limit=100");const tasks=[...data.tasks];for(let page=2;tasks.length<data.pagination.total&&page<=100;page++){const next=await apiFetch<FollowUp>("/api/meetings/"+id+"/follow-up?limit=100&page="+page);if(!next.tasks.length)break;tasks.push(...next.tasks);}return {...data,tasks:tasks.map(taskDto),activity:data.recentActivity.map(activityDto)};},[id]);const state=useDemoQuery(load);return {...state,tasks:state.data?.tasks??[],activity:state.data?.activity??[]};}
