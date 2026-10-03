import type { Meeting } from "@/types/meeting";
import { users } from "@/data/mock/users";
import { taskStatuses,taskPriorities,taskStatusLabel } from "@/lib/task-utils";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
export interface TaskFiltersValue {search:string;status:string;priority:string;meeting:string;owner:string;due:string;}
export default function TaskFilters({value,onChange,meetings}:{value:TaskFiltersValue;onChange:(value:TaskFiltersValue)=>void;meetings:Meeting[]}) {
  const change=(key:keyof TaskFiltersValue,next:string)=>onChange({...value,[key]:next});
  return <div className="grid items-end gap-4 sm:grid-cols-2 xl:grid-cols-3"><SearchInput label="Search tasks" hideLabel={false} placeholder="Search tasks..." value={value.search} onChange={e=>change("search",e.target.value)} /><Select label="Status" value={value.status} onChange={e=>change("status",e.target.value)} options={[{value:"",label:"All statuses"},...taskStatuses.map(v=>({value:v,label:taskStatusLabel(v)}))]} /><Select label="Priority" value={value.priority} onChange={e=>change("priority",e.target.value)} options={[{value:"",label:"All priorities"},...taskPriorities.map(v=>({value:v,label:taskStatusLabel(v)}))]} /><Select label="Source Meeting" value={value.meeting} onChange={e=>change("meeting",e.target.value)} options={[{value:"",label:"All meetings"},...meetings.map(m=>({value:m.id,label:m.title}))]} /><Select label="Owner" value={value.owner} onChange={e=>change("owner",e.target.value)} options={[{value:"",label:"All owners"},...users.map(u=>({value:u.id,label:u.name}))]} /><Input label="Due date" type="date" value={value.due} onChange={e=>change("due",e.target.value)} /></div>;
}
