"use client";
import { useState } from "react";
import type { Task, TaskStatus } from "@/types/task";
import { updateTask } from "@/services/task.service";
import { Toast } from "@/components/ui/toast";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
export function useTaskActions() {
  const [notice,setNotice]=useState<{title:string;description:string;variant:"success"|"error"}>();
  const [blocked,setBlocked]=useState<Task>();const [reason,setReason]=useState("");
  const save=(task:Task,status:TaskStatus,blockedReason?:string)=>{
    try{updateTask(task.id,{status,...(blockedReason!==undefined?{blockedReason}:{})});setNotice({title:"Task updated.",description:"Saved in this browser only.",variant:"success"});setBlocked(undefined);}
    catch(cause){setNotice({title:"Unable to update task",description:cause instanceof Error?cause.message:"Try again.",variant:"error"});}
  };
  return { onStatus:(task:Task,status:TaskStatus)=>{if(status==="BLOCKED"){setBlocked(task);setReason(task.blockedReason??"");}else save(task,status);},
    feedback:<>{notice&&!blocked&&<div className="fixed inset-x-4 bottom-4 z-[var(--z-toast)] sm:left-auto"><Toast {...notice} onDismiss={()=>setNotice(undefined)} /></div>}<Modal open={Boolean(blocked)} onClose={()=>setBlocked(undefined)} title="Mark task blocked" description={blocked?.title} confirmLabel="Update task" onConfirm={()=>{if(blocked)save(blocked,"BLOCKED",reason);}}><Textarea label="Blocked reason (optional)" value={reason} onChange={e=>setReason(e.target.value)} />{notice?.variant==="error"&&<p role="alert" className="mt-3 text-sm text-danger-foreground">{notice.description}</p>}</Modal></> };
}
