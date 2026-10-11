"use client";
import { useEffect, useState } from "react";
import { WORKSPACE_CHANGED } from "@/lib/api-client";
import { DEMO_CHANGED } from "@/lib/demo-store";
/** Accepts stable synchronous preference loaders or asynchronous API adapters. */
export function useDemoQuery<T>(load:()=>T|Promise<T>) {
 const [state,setState]=useState<{data:T|null;loading:boolean;error:string}>({data:null,loading:true,error:""});
 useEffect(()=>{let active=true,sequence=0;const refresh=()=>{const current=++sequence;Promise.resolve().then(load).then(data=>{if(active&&current===sequence)setState({data,loading:false,error:""});}).catch(error=>{if(active&&current===sequence)setState({data:null,loading:false,error:error instanceof Error?error.message:"Unable to load data."});});};refresh();window.addEventListener(WORKSPACE_CHANGED,refresh);window.addEventListener(DEMO_CHANGED,refresh);return()=>{active=false;window.removeEventListener(WORKSPACE_CHANGED,refresh);window.removeEventListener(DEMO_CHANGED,refresh);};},[load]);return state;
}
