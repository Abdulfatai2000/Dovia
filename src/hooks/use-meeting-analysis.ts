"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { MeetingAnalysis } from "@/types/ai";
import { getMeetingAnalysis, analyzeMeeting, regenerateMeeting } from "@/services/ai.service";
export function useMeetingAnalysis(meetingId:string){
 const [analysis,setAnalysis]=useState<MeetingAnalysis|null>(null),[loading,setLoading]=useState(true),[processing,setProcessing]=useState(false),[error,setError]=useState("");
 const busy=useRef(false),sequence=useRef(0);
 const reload=useCallback(async()=>{const request=++sequence.current;setLoading(true);setError("");try{const result=await getMeetingAnalysis(meetingId);if(request===sequence.current){setAnalysis(result.analysis);setProcessing(result.processing);}}catch(cause){if(request===sequence.current)setError(cause instanceof Error?cause.message:"Unable to load meeting analysis.");}finally{if(request===sequence.current)setLoading(false);}},[meetingId]);
 useEffect(()=>{Promise.resolve().then(reload);return()=>{sequence.current++;};},[reload]);
 async function generate(regenerate=false){if(busy.current)return;busy.current=true;setProcessing(true);setError("");try{const result=regenerate&&analysis?await regenerateMeeting(meetingId,analysis.id):await analyzeMeeting(meetingId);setAnalysis(result);}catch(cause){setError(cause instanceof Error?cause.message:"Unable to analyze meeting.");}finally{busy.current=false;setProcessing(false);}}
 return {analysis,setAnalysis,loading,processing,error,reload,generate};
}
