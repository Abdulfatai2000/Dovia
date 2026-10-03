"use client";
import { useEffect, useState } from "react";
import { getTasks, getTaskActivity, TASKS_CHANGED } from "@/services/task.service";
import { OUTCOMES_CHANGED } from "@/services/meeting-outcome.service";
import type { Task, TaskActivity } from "@/types/task";
export function useTasks() {
  const [state,setState]=useState<{tasks:Task[];activity:TaskActivity[];loading:boolean;error:string}>({tasks:[],activity:[],loading:true,error:""});
  useEffect(()=>{
    let active=true;
    const load=()=>{Promise.resolve().then(()=>{if(!active)return;try{setState({tasks:getTasks(),activity:getTaskActivity(),loading:false,error:""});}catch(cause){setState(current=>({...current,loading:false,error:cause instanceof Error?cause.message:"Unable to load tasks."}));}});};
    load();window.addEventListener("storage",load);window.addEventListener(TASKS_CHANGED,load);window.addEventListener(OUTCOMES_CHANGED,load);
    return()=>{active=false;window.removeEventListener("storage",load);window.removeEventListener(TASKS_CHANGED,load);window.removeEventListener(OUTCOMES_CHANGED,load);};
  },[]);
  return state;
}
