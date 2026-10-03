"use client";

import { useState } from "react";
import { CalendarDays, Plus } from "lucide-react";
import { useMeetings } from "@/hooks/use-meetings";
import { meetingTypes, teams, DEMO_TODAY } from "@/data/mock/meetings";
import { PageHeader } from "@/components/ui/page-header";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";
import { Tabs } from "@/components/ui/tabs";
import { ButtonLink } from "@/components/ui/button-link";
import { EmptyState } from "@/components/ui/empty-state";
import MeetingCard from "./meeting-card";
import { MeetingLoading, MeetingNotFound } from "./meeting-state";

export default function MeetingList() {
  const { meetings, loading, error } = useMeetings();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [team, setTeam] = useState("");
  const [tab, setTab] = useState("Upcoming");
  if (loading) return <MeetingLoading />;
  if (error) return <MeetingNotFound error={error} />;
  const filtered = meetings.filter(m =>
    m.title.toLowerCase().includes(search.trim().toLowerCase()) && (!status || m.status === status) &&
    (!type || m.meetingType === type) && (!team || m.team === team) &&
    (tab === "Drafts" ? m.status === "DRAFT" : tab === "Completed" ? m.status === "COMPLETED" :
      tab === "Past" ? m.date < DEMO_TODAY && m.status !== "DRAFT" : m.date >= DEMO_TODAY && ["SCHEDULED", "IN_PROGRESS"].includes(m.status))
  ).sort((a,b) => (a.date + a.startTime).localeCompare(b.date + b.startTime));
  const content = <><p role="status" className="mb-4 text-sm text-text-muted">{filtered.length} meeting{filtered.length === 1 ? "" : "s"}</p>
    {filtered.length ? <div className="grid gap-5 xl:grid-cols-2">{filtered.map(m => <MeetingCard key={m.id} meeting={m} />)}</div> :
      <EmptyState icon={<CalendarDays />} title="No meetings found" description="Try changing your filters or create a new meeting." action={<ButtonLink href="/meetings/new">Create Meeting</ButtonLink>} />}</>;
  return <div className="space-y-6">
    <PageHeader title="Meetings" description="Plan meetings, keep context together, and follow every decision through." actions={<ButtonLink href="/meetings/new"><Plus aria-hidden="true" />New Meeting</ButtonLink>} />
    <p className="text-xs text-text-muted">Demo calendar · October 5, 2026 · Created meetings are stored only in this browser.</p>
    <div className="grid items-end gap-4 md:grid-cols-2 xl:grid-cols-4">
      <SearchInput label="Search meetings" placeholder="Search meetings..." value={search} onChange={e => setSearch(e.target.value)} />
      <Select label="Status" value={status} onChange={e => setStatus(e.target.value)} options={[{value:"",label:"All statuses"}, ...["DRAFT","SCHEDULED","IN_PROGRESS","PROCESSING","REVIEW","COMPLETED","CANCELLED"].map(value => ({value,label:value.replaceAll("_"," ").toLowerCase()}))]} />
      <Select label="Meeting type" value={type} onChange={e => setType(e.target.value)} options={[{value:"",label:"All types"}, ...meetingTypes.map(value => ({value,label:value}))]} />
      <Select label="Team / Project" value={team} onChange={e => setTeam(e.target.value)} options={[{value:"",label:"All teams"}, ...teams.map(value => ({value,label:value}))]} />
    </div>
    <Tabs label="Meeting lists" value={tab} onValueChange={setTab} items={["Upcoming","Past","Drafts","Completed"].map(value => ({value,label:value,content:tab === value ? content : null}))} />
  </div>;
}
