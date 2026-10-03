"use client";
import { useEffect,useState } from "react";
import { DEMO_CHANGED,DEMO_RESET } from "@/lib/demo-store";
import { TASKS_CHANGED } from "@/services/task.service";
import { OUTCOMES_CHANGED } from "@/services/meeting-outcome.service";
/** Pass a stable service function (or useCallback) so subscriptions remain stable. */
export function useDemoQuery<T>(load:()=>T){
  const [state,setState]=useState<{data:T|null;loading:boolean;error:string}>({data:null,loading:true,error:""});
  useEffect(()=>{let active=true;const refresh=()=>{Promise.resolve().then(()=>{if(!active)return;try{setState({data:load(),loading:false,error:""});}catch(cause){setState({data:null,loading:false,error:cause instanceof Error?cause.message:"Unable to load demo data."});}});};
    const events=["storage",DEMO_CHANGED,DEMO_RESET,TASKS_CHANGED,OUTCOMES_CHANGED];refresh();events.forEach(event=>window.addEventListener(event,refresh));return()=>{active=false;events.forEach(event=>window.removeEventListener(event,refresh));};
  },[load]);return state;
}
