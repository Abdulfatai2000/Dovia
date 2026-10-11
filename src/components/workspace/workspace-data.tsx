"use client";
import { useEffect, useState, type ReactNode } from "react";
import { loadWorkspaceMembers, clearWorkspaceMembers } from "@/services/team.service";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
export function WorkspaceData({children}:{children:ReactNode}) {
 const [state,setState]=useState({ready:false,error:""});const [retry,setRetry]=useState(0);
 useEffect(()=>{let active=true;loadWorkspaceMembers().then(()=>{if(active)setState({ready:true,error:""});}).catch(error=>{if(active)setState({ready:false,error:error instanceof Error?error.message:"Unable to load workspace."});});return()=>{active=false;clearWorkspaceMembers();};},[retry]);
 if(state.error)return <ErrorState description={state.error} onRetry={()=>setRetry(value=>value+1)} />;
 if(!state.ready)return <LoadingState label="Loading your workspace?" />;
 return children;
}
