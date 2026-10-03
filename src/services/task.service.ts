import { tasks as seedTasks } from "@/data/mock/tasks";
import { users } from "@/data/mock/users";
import { readStored, writeStored } from "@/lib/demo-store";
import { getConfirmedDemoTasks } from "./meeting-outcome.service";
import { getMeeting } from "./meeting.service";
import { CURRENT_USER_ID, summarizeTasks, taskPriorities, taskStatuses, taskStatusLabel } from "@/lib/task-utils";
import type { Task, TaskInput, TaskChanges, TaskActivity } from "@/types/task";

const KEY = "dovia_demo_tasks";
export const TASKS_CHANGED = "dovia-demo-tasks-changed";
type Patch = { changes:TaskChanges; source:TaskChanges; updatedAt:string; completedAt?:string };
interface Store { manual:Task[]; updates:Record<string,Patch>; activity:TaskActivity[]; }
const object = (v:unknown): v is Record<string,unknown> => Boolean(v) && typeof v === "object" && !Array.isArray(v);
const dateValid = (v:unknown) => typeof v === "string" && (!v || /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v)) && new Date(v+"T12:00:00Z").toISOString().slice(0,10) === v);
function validChanges(value:unknown): value is TaskChanges {
  if (!object(value)) return false;
  return Object.entries(value).every(([key,v]) => {
    if (["title","description","blockedReason"].includes(key)) return typeof v === "string";
    if (key === "assigneeId") return typeof v === "string" && (!v || users.some(u=>u.id===v));
    if (key === "dueDate") return dateValid(v);
    if (key === "priority") return taskPriorities.some(p=>p===v);
    if (key === "status") return taskStatuses.some(s=>s===v);
    return false;
  });
}
function read(): Store {
  if (typeof window === "undefined") return {manual:[],updates:{},activity:[]};
  try {
    const value:unknown = JSON.parse(readStored(KEY) ?? '{"manual":[],"updates":{},"activity":[]}');
    if (!object(value) || !Array.isArray(value.manual) || !object(value.updates) || !Array.isArray(value.activity)) throw new Error();
    for (const task of value.manual) {
      if (!object(task) || typeof task.id !== "string" || !task.id.startsWith("manual-") || typeof task.title !== "string" || !taskPriorities.some(p=>p===task.priority) || !taskStatuses.some(s=>s===task.status)) throw new Error();
      for (const key of ["description","meetingId","assigneeId","blockedReason","createdAt","updatedAt","completedAt"]) if (task[key] !== undefined && typeof task[key] !== "string") throw new Error();
      if (task.dueDate !== undefined && !dateValid(task.dueDate)) throw new Error();
    }
    for (const patch of Object.values(value.updates)) if (!object(patch) || !validChanges(patch.changes) || !validChanges(patch.source) || typeof patch.updatedAt !== "string" || (patch.completedAt !== undefined && typeof patch.completedAt !== "string")) throw new Error();
    for (const a of value.activity) if (!object(a) || ["id","taskId","actorId","message","timestamp"].some(key=>typeof a[key]!=="string")) throw new Error();
    return value as unknown as Store;
  } catch { throw new Error("Unable to read demo tasks. Check browser storage before continuing."); }
}
function write(store:Store) {
  writeStored(KEY, JSON.stringify(store));
  window.dispatchEvent(new Event(TASKS_CHANGED));
}
function bases(store:Store) { return [...seedTasks,...getConfirmedDemoTasks(),...store.manual]; }
function apply(base:Task, patch?:Patch):Task {
  if (!patch) return base;
  const changes:TaskChanges = {};
  for (const key of Object.keys(patch.changes) as (keyof TaskChanges)[]) {
    // A newly reviewed source value supersedes an old override for that field.
    if ((base[key] ?? "") === (patch.source[key] ?? "")) Object.assign(changes,{[key]:patch.changes[key]});
  }
  const task = {...base,...changes,updatedAt:patch.updatedAt};
  return {...task,completedAt:task.status === "COMPLETED" ? (patch.completedAt || base.completedAt) : undefined};
}
export function getTasks():Task[] {
  const store=read();
  return [...new Map(bases(store).map(task=>[task.id,apply(task,store.updates[task.id])])).values()];
}
export const getTask = (id:string) => getTasks().find(task=>task.id===id);
export const getTasksForMeeting = (id:string) => getTasks().filter(task=>task.meetingId===id);
export const getTasksForUser = (id:string) => getTasks().filter(task=>task.assigneeId===id);
export const getTaskStats = (tasks:Task[]=getTasks()) => summarizeTasks(tasks);
export const getTaskActivity = () => read().activity;
function validate(input:TaskInput) {
  if (!input.title.trim()) throw new Error("Enter a task title.");
  if (!users.some(user=>user.id===input.assigneeId)) throw new Error("Choose a task owner.");
  if (!taskPriorities.includes(input.priority) || !taskStatuses.includes(input.status)) throw new Error("Choose a valid priority and status.");
  if (input.dueDate && !dateValid(input.dueDate)) throw new Error("Choose a valid due date.");
}
export function createTask(input:TaskInput):Task {
  validate(input);
  if (input.meetingId && !getMeeting(input.meetingId)) throw new Error("The selected source meeting is unavailable.");
  const store=read(), timestamp=new Date().toISOString();
  const task:Task={...input,title:input.title.trim(),id:`manual-${crypto.randomUUID()}`,createdAt:timestamp,updatedAt:timestamp,completedAt:input.status==="COMPLETED"?timestamp:undefined};
  store.manual.push(task);
  store.activity.unshift({id:crypto.randomUUID(),taskId:task.id,actorId:CURRENT_USER_ID,message:"Created a demo task",timestamp});
  write(store);return task;
}
export function updateTask(id:string,changes:TaskChanges):Task {
  if (!validChanges(changes)) throw new Error("The task changes are not valid.");
  const store=read(), base=bases(store).find(task=>task.id===id);
  if (!base) throw new Error("Task not found in the demo workspace.");
  const current=apply(base,store.updates[id]);
  const next={...current,...changes};validate(next);
  const changed=(Object.keys(changes) as (keyof TaskChanges)[]).filter(key=>(current[key]??"")!==(changes[key]??""));
  if (!changed.length) return current;
  const timestamp=new Date().toISOString();
  const patch:Patch={changes:{},source:{},updatedAt:timestamp,completedAt:next.status==="COMPLETED"?(current.completedAt||timestamp):undefined};
  for (const key of ["title","description","assigneeId","dueDate","priority","status","blockedReason"] as const) {
    if ((next[key]??"")!==(base[key]??"")) { Object.assign(patch.changes,{[key]:next[key]??""});Object.assign(patch.source,{[key]:base[key]??""}); }
  }
  store.updates[id]=patch;
  const messages=changed.map(key=>key==="status"?`Status changed to ${taskStatusLabel(next.status)}`:key==="dueDate"?"Deadline updated":key==="assigneeId"?"Owner updated":key==="blockedReason"?"Blocked reason updated":`${taskStatusLabel(key)} updated`);
  store.activity.unshift({id:crypto.randomUUID(),taskId:id,actorId:CURRENT_USER_ID,message:messages.join(" · "),timestamp});
  write(store);return apply(base,patch);
}

