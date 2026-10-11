"use client";

import { apiFetch, changed } from "@/lib/api-client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { useState } from "react";
import { useMeetings } from "@/hooks/use-meetings";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/tabs";
import { Toast } from "@/components/ui/toast";
import { Modal } from "@/components/ui/modal";
import { SectionHeader } from "@/components/ui/section-header";
import MeetingHeader from "./meeting-header";
import MeetingAgenda from "./meeting-agenda";
import MeetingParticipants from "./meeting-participants";
import MeetingFiles from "./meeting-files";
import MeetingCarryOver from "./meeting-carry-over";
import CompletedMeeting from "./completed-meeting";
import { MeetingLoading, MeetingNotFound } from "./meeting-state";

export default function MeetingWorkspace({ meetingId, created = false }: { meetingId: string; created?: boolean }) {
  const { meetings, loading, error } = useMeetings();
  const [showCreated, setShowCreated] = useState(created);
  const [edit, setEdit] = useState(false);
  const [draft,setDraft]=useState({title:"",description:"",status:"SCHEDULED"});
  const [saving,setSaving]=useState(false);
  const [failure,setFailure]=useState("");
  const [tab, setTab] = useState("overview");
  const meeting = meetings.find(m => m.id === meetingId);
  if (loading) return <MeetingLoading />;
  if (error || !meeting) return <MeetingNotFound error={error} />;
  if (meeting.status === "COMPLETED") return <CompletedMeeting key={meeting.id} meeting={meeting} />;
  const agenda = <MeetingAgenda agenda={meeting.agenda} />;
  const participants = <MeetingParticipants participants={meeting.participants} />;
  const files = <MeetingFiles files={meeting.files} />;
  const overview = <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]"><div className="min-w-0 space-y-6">
    <Card className="space-y-4 p-5"><SectionHeader title="Meeting Details" /><p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-text-secondary">{meeting.description || "No description provided."}</p><div className="flex flex-wrap gap-2"><Badge variant="neutral">{meeting.meetingType}</Badge>{meeting.team && <Badge variant="primary">{meeting.team}</Badge>}{meeting.tags?.map(tag => <Badge key={tag}>{tag}</Badge>)}</div></Card>
    <MeetingCarryOver meeting={meeting} />{agenda}</div><div className="min-w-0 space-y-6">{participants}{files}</div></div>;
  return <div className="space-y-6"><MeetingHeader meeting={meeting} onEdit={() => {setDraft({title:meeting.title,description:meeting.description??"",status:meeting.status});setFailure("");setEdit(true);}} />
    <p className="text-xs text-text-muted">Meeting · Start Meeting opens content capture; it does not launch a live call.</p>
    {meeting.status === "REVIEW" && <ButtonLink href={`/meetings/${meeting.id}/ai-review`}>Review AI draft</ButtonLink>}
    <Tabs label="Meeting workspace" value={tab} onValueChange={setTab} items={[
      {value:"overview",label:"Overview",content:tab === "overview" ? overview : null},
      {value:"agenda",label:"Agenda",content:tab === "agenda" ? agenda : null},
      {value:"participants",label:"Participants",content:tab === "participants" ? participants : null},
      {value:"files",label:"Files",content:tab === "files" ? files : null},
    ]} />
    <Modal open={edit} onClose={() => setEdit(false)} title="Edit meeting"><form className="space-y-4" onSubmit={async event=>{event.preventDefault();if(saving)return;setSaving(true);try{await apiFetch("/api/meetings/"+meetingId,{method:"PATCH",body:JSON.stringify(draft)});changed();setEdit(false);}catch(error){setFailure(error instanceof Error?error.message:"Unable to save meeting.");}finally{setSaving(false);}}}><Input label="Title" required value={draft.title} onChange={event=>setDraft({...draft,title:event.target.value})} /><Textarea label="Description" value={draft.description} onChange={event=>setDraft({...draft,description:event.target.value})} /><Select label="Status" value={draft.status} onChange={event=>setDraft({...draft,status:event.target.value})} options={["DRAFT","SCHEDULED","IN_PROGRESS","COMPLETED","CANCELLED"].map(value=>({value,label:value.replaceAll("_"," ")}))} />{failure&&<p role="alert" className="text-sm text-danger-foreground">{failure}</p>}<Button type="submit" loading={saving}>Save changes</Button></form></Modal>
    {showCreated && <div className="fixed inset-x-4 bottom-4 z-[var(--z-toast)] sm:left-auto"><Toast variant="success" title="Meeting created." description="Saved to your workspace. No invitations were sent." onDismiss={() => setShowCreated(false)} /></div>}
  </div>;
}
