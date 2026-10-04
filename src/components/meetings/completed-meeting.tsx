"use client";
import { useState } from "react";
import { Share2, MoreHorizontal } from "lucide-react";
import type { Meeting } from "@/types/meeting";
import { useMeetingAnalysis } from "@/hooks/use-meeting-analysis";
import { getUser } from "@/services/team.service";
import { formatDate, formatTime } from "@/lib/meeting-format";
import { PageHeader } from "@/components/ui/page-header";
import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Dropdown } from "@/components/ui/dropdown";
import { StatusBadge } from "@/components/ui/status-badge";
import { PriorityBadge } from "@/components/ui/priority-badge";
import { Tabs } from "@/components/ui/tabs";
import { Toast } from "@/components/ui/toast";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from "@/components/ui/table";
import MeetingFiles from "./meeting-files";
import MeetingParticipants from "./meeting-participants";
import { MeetingLoading, MeetingNotFound } from "./meeting-state";

function RecordSection({ title, items }: { title: string; items: string[] }) {
  return <Card className="space-y-4 p-5"><SectionHeader title={title} />{items.length ? <ul className="list-inside list-disc space-y-3 text-sm text-text-secondary">{items.map((item,index) => <li key={index} className="whitespace-pre-wrap break-words">{item}</li>)}</ul> : <p className="text-sm text-text-muted">None recorded.</p>}</Card>;
}
export default function CompletedMeeting({ meeting }: { meeting: Meeting }) {
  const { analysis, error } = useMeetingAnalysis(meeting.id);
  const [share,setShare] = useState(false);
  if (error) return <MeetingNotFound error={error} />;
  if (!analysis) return <MeetingLoading />;
  const organizer = meeting.participants.find(person => person.organizer);
  const decisions = <RecordSection title="Key Decisions" items={analysis.decisions.map(item => item.description)} />;
  const notes = <RecordSection title="Important Notes" items={analysis.importantNotes.filter(note => note.trim())} />;
  const actions = <div className="space-y-4"><SectionHeader title="Confirmed Action Items" description="These are the reviewed values saved for this demo meeting." />
    {analysis.actionItems.length ? <Table containerLabel="Confirmed meeting action items" className="min-w-[680px]"><TableCaption>Confirmed demo action items. No backend tasks have been created.</TableCaption>
      <TableHeader><TableRow>{["Task","Owner","Due Date","Priority","Status"].map(label => <TableHead key={label}>{label}</TableHead>)}</TableRow></TableHeader>
      <TableBody>{analysis.actionItems.map(item => <TableRow key={item.id}><TableCell className="max-w-sm break-words font-medium">{item.title}</TableCell><TableCell>{getUser(item.assigneeId ?? "")?.name ?? "Unassigned"}</TableCell><TableCell>{item.suggestedDeadline ? formatDate(item.suggestedDeadline) : "Not set"}</TableCell><TableCell><PriorityBadge priority={item.priority ?? "MEDIUM"} /></TableCell><TableCell><StatusBadge status={item.status ?? "NOT_STARTED"} /></TableCell></TableRow>)}</TableBody>
    </Table> : <Card className="p-5 text-sm text-text-muted">No action items were recorded for this meeting.</Card>}</div>;
  const summary = <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]"><div className="min-w-0 space-y-5"><Card className="space-y-4 p-5"><SectionHeader title="Meeting Summary" /><p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-text-secondary">{analysis.summary}</p></Card>{decisions}<RecordSection title="Open Questions" items={analysis.openQuestions.map(item => item.question)} /><RecordSection title="Risks & Blockers" items={analysis.risks.map(item => `${item.severity ?? "MEDIUM"}: ${item.description}`)} />{notes}</div>
    <aside className="min-w-0 space-y-5"><Card className="space-y-4 p-5"><SectionHeader title="Meeting Details" /><dl className="space-y-3 text-sm"><div><dt className="text-text-muted">When</dt><dd>{formatDate(meeting.date)} · {formatTime(meeting.startTime)}</dd></div><div><dt className="text-text-muted">Platform</dt><dd>{meeting.platform}</dd></div><div><dt className="text-text-muted">Organizer</dt><dd>{getUser(organizer?.userId ?? "")?.name ?? "Not specified"}</dd></div><div><dt className="text-text-muted">Record</dt><dd>{analysis.confirmedAt ? "Confirmed in this browser" : "Illustrative completed demo record"}</dd></div></dl></Card><MeetingParticipants participants={meeting.participants} /></aside></div>;
  return <div className="space-y-6"><PageHeader title={meeting.title} eyebrow="Meeting record" breadcrumbs={<ButtonLink href="/meetings" variant="ghost" size="sm">← Back to Meetings</ButtonLink>}
    actions={<><Button variant="outline" onClick={() => setShare(true)}><Share2 aria-hidden="true" />Share</Button><Dropdown label="More Actions" trigger={<MoreHorizontal aria-hidden="true" />} items={[{id:"review",label:"Review confirmed outcome",href:`/meetings/${meeting.id}/ai-review`},{id:"follow",label:"View Follow-up Progress",href:`/meetings/${meeting.id}/follow-up`}]} /></>} />
    <div className="flex flex-wrap items-center gap-3 text-sm text-text-secondary"><StatusBadge status="COMPLETED" /><span>{formatDate(meeting.date)} · {formatTime(meeting.startTime)} · {meeting.platform} · {meeting.participants.length} attendees</span></div>
    <p className="text-xs text-text-muted">Demo record · Saved locally. No cloud sharing or backend task creation.</p>
    <Tabs label="Completed meeting" items={[{value:"summary",label:"Summary",content:summary},{value:"actions",label:"Action Items",content:actions},{value:"decisions",label:"Decisions",content:decisions},{value:"notes",label:"Notes",content:notes},{value:"files",label:"Files",content:<MeetingFiles files={meeting.files} />}]} />
    <ButtonLink href={`/meetings/${meeting.id}/follow-up`}>View Follow-up Progress</ButtonLink>
    {share && <div className="fixed inset-x-4 bottom-4 z-[var(--z-toast)] sm:left-auto"><Toast variant="info" title="Sharing will be connected in a later phase." description="No link was published and no one was notified." onDismiss={() => setShare(false)} /></div>}
  </div>;
}

