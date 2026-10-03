"use client";
import { Plus, Trash2 } from "lucide-react";
import type { MeetingActionItem } from "@/types/ai";
import { users } from "@/data/mock/users";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell, TableCaption } from "@/components/ui/table";
import { statusPresentation } from "@/components/ui/status-badge";

export default function ActionItemEditor({ items, onChange }: { items: MeetingActionItem[]; onChange: (items: MeetingActionItem[]) => void }) {
  const update = (id: string, patch: Partial<MeetingActionItem>) => onChange(items.map(item => item.id === id ? {...item,...patch} : item));
  return <div className="space-y-4"><h2 className="dovia-section-title">Action Items</h2>
    <p className="text-sm text-text-secondary">Suggestions are not assignments. Choose each owner explicitly, and review every deadline before confirming.</p>
    {items.length ? <Table containerLabel="Editable action items" className="min-w-[1000px]">
      <TableCaption>All fields are reviewed demo values. Scroll horizontally to edit every column.</TableCaption>
      <TableHeader><TableRow>{["Task","Assignee","Deadline","Priority","Status","Actions"].map(label => <TableHead key={label}>{label}</TableHead>)}</TableRow></TableHeader>
      <TableBody>{items.map((item,index) => <TableRow key={item.id}>
        <TableCell className="min-w-64"><Input label={`Task ${index+1}`} hideLabel required value={item.title} onChange={e => update(item.id,{title:e.target.value})} /></TableCell>
        <TableCell className="min-w-52"><Select label={`Assignee for task ${index+1}`} hideLabel required value={item.assigneeId ?? ""} onChange={e => update(item.id,{assigneeId:e.target.value})}
          options={[{value:"",label:"Choose reviewed owner"},...users.map(user => ({value:user.id,label:user.name}))]} helperText={item.suggestedAssigneeName ? `Suggested: ${item.suggestedAssigneeName}` : "Select a workspace member."} /></TableCell>
        <TableCell className="min-w-44"><Input type="date" label={`Deadline for task ${index+1}`} hideLabel required value={item.suggestedDeadline ?? ""} onChange={e => update(item.id,{suggestedDeadline:e.target.value})} /></TableCell>
        <TableCell className="min-w-36"><Select label={`Priority for task ${index+1}`} hideLabel value={item.priority ?? "MEDIUM"} onChange={e => update(item.id,{priority:e.target.value as MeetingActionItem["priority"]})} options={["LOW","MEDIUM","HIGH","URGENT"].map(value => ({value,label:value.charAt(0)+value.slice(1).toLowerCase()}))} /></TableCell>
        <TableCell className="min-w-44"><Select label={`Status for task ${index+1}`} hideLabel value={item.status ?? "NOT_STARTED"} onChange={e => update(item.id,{status:e.target.value as MeetingActionItem["status"]})} options={(["NOT_STARTED","IN_PROGRESS","BLOCKED","COMPLETED","OVERDUE"] as const).map(value => ({value,label:statusPresentation[value].label}))} /></TableCell>
        <TableCell><IconButton aria-label={`Remove action item ${index+1}`} onClick={() => onChange(items.filter(entry => entry.id !== item.id))}><Trash2 aria-hidden="true" /></IconButton></TableCell>
      </TableRow>)}</TableBody>
    </Table> : <p className="text-sm text-text-muted">No action items. Add an item if follow-up work was agreed.</p>}
    <Button variant="outline" onClick={() => onChange([...items,{id:crypto.randomUUID(),title:"",priority:"MEDIUM",status:"NOT_STARTED"}])}><Plus aria-hidden="true" />Add action item</Button>
  </div>;
}
