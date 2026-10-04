"use client";
import { useState, useRef, type FormEvent } from "react";
import type { Task, TaskInput } from "@/types/task";
import type { Meeting } from "@/types/meeting";
import { getTeamMembers } from "@/services/team.service";
import { CURRENT_USER_ID, taskPriorities, taskStatuses, taskStatusLabel } from "@/lib/task-utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function TaskForm({ task, meetings, onSave, onCancel }: {task?:Task;meetings:Meeting[];onSave:(input:TaskInput)=>void;onCancel?:()=>void}) {
  const [value,setValue]=useState<TaskInput>({title:task?.title??"",description:task?.description??"",meetingId:task?.meetingId??"",assigneeId:task?.assigneeId??CURRENT_USER_ID,dueDate:task?.dueDate??"",priority:task?.priority??"MEDIUM",status:task?.status??"NOT_STARTED",blockedReason:task?.blockedReason??""});
  const [errors,setErrors]=useState<Record<string,string>>({});
  const [failure,setFailure]=useState("");
  const form=useRef<HTMLFormElement>(null);
  const patch=(input:Partial<TaskInput>)=>{setValue(current=>({...current,...input}));setFailure("");};
  function submit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();const next:Record<string,string>={};
    if(!value.title.trim())next.title="Enter a task title.";
    if(!getTeamMembers().some(user=>user.id===value.assigneeId))next.assigneeId="Choose an owner.";
    if(!taskPriorities.includes(value.priority))next.priority="Choose a priority.";
    if(!taskStatuses.includes(value.status))next.status="Choose a status.";
    setErrors(next);
    if(Object.keys(next).length){requestAnimationFrame(()=>{const field=form.current?.elements.namedItem(Object.keys(next)[0]);if(field instanceof HTMLElement)field.focus();});return;}
    try{onSave(value);}catch(cause){setFailure(cause instanceof Error?cause.message:"Unable to save task.");}
  }
  return <form ref={form} noValidate onSubmit={submit} className="space-y-4">
    {(failure||Object.keys(errors).length>0)&&<p role="alert" className="rounded-md bg-danger-soft p-3 text-sm text-danger-foreground">{failure||"Check the highlighted fields below."}</p>}
    <Input name="title" label="Task title" required value={value.title} error={errors.title} onChange={e=>patch({title:e.target.value})} />
    <Textarea label="Description (optional)" value={value.description} onChange={e=>patch({description:e.target.value})} />
    {!task&&<Select label="Source meeting (optional)" value={value.meetingId} onChange={e=>patch({meetingId:e.target.value})} options={[{value:"",label:"No source meeting"},...meetings.map(m=>({value:m.id,label:m.title}))]} />}
    <div className="grid gap-4 sm:grid-cols-2"><Select name="assigneeId" label="Assignee" required value={value.assigneeId} error={errors.assigneeId} onChange={e=>patch({assigneeId:e.target.value})} options={[{value:"",label:"Choose owner"},...getTeamMembers().map(user=>({value:user.id,label:user.name}))]} />
      <Input name="dueDate" label="Due date (optional)" type="date" value={value.dueDate} onChange={e=>patch({dueDate:e.target.value})} />
      <Select name="priority" label="Priority" required value={value.priority} error={errors.priority} onChange={e=>patch({priority:e.target.value as TaskInput["priority"]})} options={taskPriorities.map(v=>({value:v,label:taskStatusLabel(v)}))} />
      <Select name="status" label="Status" required value={value.status} error={errors.status} onChange={e=>patch({status:e.target.value as TaskInput["status"]})} options={taskStatuses.map(v=>({value:v,label:taskStatusLabel(v)}))} /></div>
    {value.status==="BLOCKED"&&<Textarea label="Blocked reason (optional)" placeholder="e.g. Waiting for production API credentials." value={value.blockedReason} onChange={e=>patch({blockedReason:e.target.value})} />}
    <div className="flex flex-wrap gap-3"><Button type="submit">{task?"Save changes":"Add Task"}</Button>{onCancel&&<Button variant="outline" onClick={onCancel}>Cancel</Button>}</div>
    <p className="text-xs text-text-muted">Demo persistence in this browser only.</p>
  </form>;
}
