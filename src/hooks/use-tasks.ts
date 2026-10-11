"use client";
import { getTasks,getTaskActivity } from "@/services/task.service";
import { useDemoQuery } from "./use-demo-query";
async function load(){const [tasks,activity]=await Promise.all([getTasks(),getTaskActivity()]);return {tasks,activity};}
export function useTasks(){const state=useDemoQuery(load);return {...state,tasks:state.data?.tasks??[],activity:state.data?.activity??[]};}
