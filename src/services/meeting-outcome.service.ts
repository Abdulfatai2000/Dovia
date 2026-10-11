import type { MeetingAnalysis } from "@/types/ai";
import { apiFetch, changed } from "@/lib/api-client";
import { getTeamMembers } from "./team.service";
import { getMeetingAnalysis } from "./ai.service";
const priorities=["LOW","MEDIUM","HIGH","URGENT"],statuses=["NOT_STARTED","IN_PROGRESS","BLOCKED","COMPLETED"];
export async function getConfirmedOutcome(id:string){const result=await getMeetingAnalysis(id);return result.analysis?.status==="CONFIRMED"?result.analysis:undefined;}
export function validateOutcome(analysis:MeetingAnalysis):string|null {
 if(!analysis.summary.trim())return "Add a meeting summary before confirming.";
 if(analysis.decisions.some(item=>!item.description.trim()))return "Complete or remove blank decisions.";
 if(analysis.openQuestions.some(item=>!item.question.trim()))return "Complete or remove blank open questions.";
 if(analysis.risks.some(item=>!item.description.trim()))return "Complete or remove blank risks.";
 for(const [index,item] of analysis.actionItems.entries()){
  if(!item.title.trim())return "Add a title for action item "+(index+1)+".";
  if(!getTeamMembers().some(member=>member.id===item.assigneeId))return "Choose a reviewed owner for action item "+(index+1)+".";
  if(item.suggestedDeadline&&(!/^\d{4}-\d{2}-\d{2}$/.test(item.suggestedDeadline)||!Number.isFinite(Date.parse(item.suggestedDeadline))))return "Choose a valid deadline for action item "+(index+1)+".";
  if(!priorities.includes(item.priority??"")||!statuses.includes(item.status??""))return "Choose priority and status for action item "+(index+1)+".";
 }return null;
}
export async function confirmMeetingOutcome(analysis:MeetingAnalysis){
 const error=validateOutcome(analysis);if(error)throw new Error(error);
 const body={analysisId:analysis.id,summary:analysis.summary,decisions:analysis.decisions,actionItems:analysis.actionItems.map(item=>({id:item.id,title:item.title,description:item.description,assigneeId:item.assigneeId,suggestedDeadline:item.suggestedDeadline,priority:item.priority,status:item.status})),openQuestions:analysis.openQuestions,risks:analysis.risks,importantNotes:analysis.importantNotes};
 const result=await apiFetch<{analysis:MeetingAnalysis;taskIds:string[];decisionIds:string[]}>("/api/meetings/"+analysis.meetingId+"/confirm",{method:"POST",body:JSON.stringify(body)});changed();return result.analysis;
}
