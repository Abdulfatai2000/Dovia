"use client";
import { useState } from "react";
import { getTeamMembers } from "@/services/team.service";
import { useTasks } from "@/hooks/use-tasks";
import { useMeetings } from "@/hooks/use-meetings";
import { activities } from "@/data/mock/activities";
import { inDemoWeek } from "@/lib/task-utils";
import { PageHeader } from "@/components/ui/page-header";
import { SectionHeader } from "@/components/ui/section-header";
import { SearchInput } from "@/components/ui/search-input";
import { Card } from "@/components/ui/card";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { Avatar } from "@/components/ui/avatar";
import ActivityFeed from "@/components/dashboard/activity-feed";
import TaskActivityFeed from "@/components/tasks/task-activity-feed";
import TeamTable from "./team-table";
import InviteMember from "./invite-member";
export default function TeamPage() {
  const taskState=useTasks();const meetingState=useMeetings();const [search,setSearch]=useState("");const members=getTeamMembers();
  if(taskState.loading||meetingState.loading)return <LoadingState label="Loading team workspace…" />;
  if(taskState.error||meetingState.error)return <div className="space-y-6"><PageHeader title="Your Team" /><ErrorState description={taskState.error||meetingState.error} /></div>;
  const visible=members.filter(member=>`${member.name} ${member.role} ${member.department}`.toLowerCase().includes(search.trim().toLowerCase()));
  const tasks=taskState.tasks;const meetings=meetingState.meetings;
  return <div className="space-y-6"><PageHeader title="Your Team" description="Collaborate, manage responsibilities, and stay aligned on meeting follow-up." actions={<InviteMember />} /><p className="text-xs text-text-muted">Demo workspace · Week of October 5, 2026 · Member status is a static example, not live presence.</p>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[{label:"Total Members",value:members.length},{label:"Teams represented",value:new Set(meetings.map(m=>m.team).filter(Boolean)).size},{label:"Open Tasks",value:tasks.filter(t=>t.status!=="COMPLETED").length},{label:"Meetings This Week",value:meetings.filter(m=>inDemoWeek(m.date)&&m.status!=="CANCELLED"&&m.status!=="DRAFT").length}].map(item=><Card key={item.label} className="space-y-2 p-5"><p className="text-sm text-text-secondary">{item.label}</p><p className="text-3xl font-semibold">{item.value}</p></Card>)}</div>
    <section className="space-y-4"><SectionHeader title="Members" /><SearchInput label="Search team members" placeholder="Search names, roles, or departments..." value={search} onChange={e=>setSearch(e.target.value)} />{visible.length?<TeamTable members={visible} tasks={tasks} />:<EmptyState title="No members found" description="Try another name, role, or department." />}</section>
    <div className="grid items-start gap-6 xl:grid-cols-2"><section className="min-w-0 space-y-4"><SectionHeader title="Workload visibility" description="Open and completed commitments, shown in team order. These are not performance scores." /><Card className="divide-y divide-border px-5">{members.map(member=>{const assigned=tasks.filter(t=>t.assigneeId===member.id);return <div key={member.id} className="flex flex-wrap items-center gap-3 py-4"><Avatar name={member.name} size="sm" /><p className="min-w-0 flex-1 text-sm font-medium">{member.name}</p><p className="text-xs text-text-secondary">{assigned.filter(t=>t.status!=="COMPLETED").length} open · {assigned.filter(t=>t.status==="COMPLETED").length} completed</p></div>;})}</Card></section>
    <section className="min-w-0 space-y-4"><SectionHeader title="Recent Team Activity" description="Changes in this browser, followed by illustrative seeded activity." /><TaskActivityFeed activity={taskState.activity} tasks={tasks} /><ActivityFeed activities={activities} /></section></div>
  </div>;
}
