import { apiFetch, changed } from "@/lib/api-client";
import type { MeetingAnalysis } from "@/types/ai";
export const AI_ENABLED = process.env.NEXT_PUBLIC_ENABLE_AI === "true";
export interface SavedAnalysis { analysis: MeetingAnalysis | null; processing: boolean; errorCode: string | null }
export function getMeetingAnalysis(id:string){return apiFetch<SavedAnalysis>("/api/meetings/"+id+"/analyze");}
export async function analyzeMeeting(id:string){const draft=await apiFetch<MeetingAnalysis>("/api/meetings/"+id+"/analyze",{method:"POST"});changed();return draft;}
export async function regenerateMeeting(id:string,analysisId:string){const draft=await apiFetch<MeetingAnalysis>("/api/ai/regenerate",{method:"POST",body:JSON.stringify({meetingId:id,analysisId})});changed();return draft;}
