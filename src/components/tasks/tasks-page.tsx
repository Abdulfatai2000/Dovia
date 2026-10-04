"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useTasks } from "@/hooks/use-tasks";
import { useMeetings } from "@/hooks/use-meetings";
import { createTask } from "@/services/task.service";
import { DEMO_TODAY } from "@/data/mock/meetings";
import { formatDate } from "@/lib/meeting-format";
import { CURRENT_USER_ID,isTaskOverdue } from "@/lib/task-utils";
import type { Task } from "@/types/task";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Tabs } from "@/components/ui/tabs";
import { Toast } from "@/components/ui/toast";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import TaskTable from "./task-table";
import TaskForm from "./task-form";
import TaskFilters,{type TaskFiltersValue} from "./task-filters";
import { useTaskActions } from "./use-task-actions";
export default function TasksPage() {
  const {tasks,loading,error}=useTasks();const meetingState=useMeetings();
  const [filters,setFilters]=useState<TaskFiltersValue>({search:"",status:"",priority:"",meeting:"",owner:CURRENT_USER_ID,due:""});
  const [tab,setTab]=useState("All");const [add,setAdd]=useState(false);const [created,setCreated]=useState(false);
  const actions=useTaskActions();
  if(loading||meetingState.loading)return <LoadingState label="Loading demo tasks…" />;
  if(error||meetingState.error)return <div className="space-y-6"><PageHeader title="My Tasks" /><ErrorState description={error||meetingState.error} /></div>;
  const matches=(task:Task)=>task.title.toLowerCase().includes(filters.search.trim().toLowerCase())&&(!filters.status||(filters.status==="OVERDUE"?isTaskOverdue(task):task.status===filters.status))&&(!filters.priority||task.priority===filters.priority)&&(!filters.meeting||task.meetingId===filters.meeting)&&(!filters.owner||task.assigneeId===filters.owner)&&(!filters.due||task.dueDate===filters.due);
  const inTab=(task:Task,name:string)=>name==="All"?true:name==="Today"?task.dueDate===DEMO_TODAY&&task.status!=="COMPLETED":name==="Upcoming"?Boolean(task.dueDate&&task.dueDate>DEMO_TODAY&&task.status!=="COMPLETED"):name==="Overdue"?isTaskOverdue(task):task.status==="COMPLETED";
  const filtered=tasks.filter(matches);const visible=filtered.filter(task=>inTab(task,tab));
  const content=visible.length?<TaskTable tasks={visible} meetings={meetingState.meetings} onStatus={actions.onStatus} />:<EmptyState title={tab==="Overdue"?"No overdue tasks 🎉":tasks.length?"No tasks match your filters.":"No tasks yet"} description="Tasks assigned from meetings will appear here. Adjust your filters or add a demo task." />;
  return <div className="space-y-6"><PageHeader eyebrow="Execution" title="My Tasks" description="Stay on top of action items created from your meetings." actions={<Button onClick={()=>setAdd(true)}><Plus aria-hidden="true" />Add Task</Button>} /><p className="text-xs text-text-muted">Demo calendar: {formatDate(DEMO_TODAY)} · Initially filtered to your demo profile. Choose All owners for workspace tasks.</p>
    <TaskFilters value={filters} onChange={setFilters} meetings={meetingState.meetings} /><Button variant="ghost" size="sm" onClick={()=>setFilters({search:"",status:"",priority:"",meeting:"",owner:"",due:""})}>Clear filters</Button>
    <Tabs label="Task views" value={tab} onValueChange={setTab} items={["All","Today","Upcoming","Overdue","Completed"].map(name=>({value:name,label:`${name} (${filtered.filter(task=>inTab(task,name)).length})`,content:tab===name?content:null}))} />
    <Modal open={add} onClose={()=>setAdd(false)} title="Add Task" description="Create a manual task in this demo workspace." size="lg">{add&&<TaskForm meetings={meetingState.meetings} onSave={input=>{createTask(input);setAdd(false);setCreated(true);}} onCancel={()=>setAdd(false)} />}</Modal>
    {created&&<div className="fixed inset-x-4 bottom-4 z-[var(--z-toast)] sm:left-auto"><Toast variant="success" title="Task created for demo." description="Saved in this browser only." onDismiss={()=>setCreated(false)} /></div>}{actions.feedback}
  </div>;
}
