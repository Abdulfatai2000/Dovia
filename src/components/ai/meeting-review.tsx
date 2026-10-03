"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw, Check, Sparkles } from "lucide-react";
import { useMeetings } from "@/hooks/use-meetings";
import { useMeetingAnalysis } from "@/hooks/use-meeting-analysis";
import { confirmMeetingOutcome, validateOutcome } from "@/services/meeting-outcome.service";
import { MeetingLoading, MeetingNotFound } from "@/components/meetings/meeting-state";
import { PageHeader } from "@/components/ui/page-header";
import { ButtonLink } from "@/components/ui/button-link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs } from "@/components/ui/tabs";
import { Modal } from "@/components/ui/modal";
import { Toast } from "@/components/ui/toast";
import { formatDate } from "@/lib/meeting-format";
import ReviewListEditor from "./review-list-editor";
import ActionItemEditor from "./action-item-editor";

export default function MeetingReview({ meetingId }: { meetingId: string }) {
  const router = useRouter();
  const { meetings, loading, error: meetingError } = useMeetings();
  const { analysis, setAnalysis, error: analysisError } = useMeetingAnalysis(meetingId);
  const [tab,setTab] = useState("summary");
  const [confirm,setConfirm] = useState(false);
  const [saving,setSaving] = useState(false);
  const [error,setError] = useState("");
  const [notice,setNotice] = useState(false);
  const errorRef = useRef<HTMLParagraphElement>(null);
  const meeting = meetings.find(item => item.id === meetingId);
  if (meetingError || analysisError) return <MeetingNotFound error={meetingError || analysisError} />;
  if (loading || !analysis) return <MeetingLoading />;
  if (!meeting) return <MeetingNotFound />;
  function requestConfirmation() {
    if (!analysis) return;
    const message = validateOutcome(analysis);
    setError(message ?? "");
    if (message) {
      setTab(message.includes("action item") || message.includes("Action items") ? "actions" : message.includes("decisions") ? "decisions" : message.includes("questions") ? "questions" : message.includes("risks") ? "risks" : "summary");
      requestAnimationFrame(() => errorRef.current?.focus());
      return;
    }
    setConfirm(true);
  }
  function save() {
    if (!analysis || saving) return;
    setSaving(true);
    try { confirmMeetingOutcome(analysis); router.push(`/meetings/${meetingId}`); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to save outcome."); setSaving(false); }
  }
  const patch = (value: Partial<typeof analysis>) => setAnalysis({...analysis,...value});
  return <div className="space-y-6">
    <PageHeader title={meeting.title} eyebrow="Review workspace" breadcrumbs={<ButtonLink href={`/meetings/${meetingId}`} variant="ghost" size="sm">← Back to Meeting</ButtonLink>}
      actions={<><Button variant="outline" onClick={() => setNotice(true)}><RotateCcw aria-hidden="true" />Regenerate</Button><Button onClick={requestConfirmation}><Check aria-hidden="true" />Confirm Meeting Outcome</Button></>} />
    <div className="flex flex-wrap items-center gap-3 text-sm text-text-secondary"><Badge variant="ai"><Sparkles aria-hidden="true" />AI Meeting Summary</Badge><span>{meeting.platform} · {formatDate(meeting.date)} · {meeting.duration} min · {meeting.participants.length} participants</span></div>
    <Card className="space-y-2 border-ai/20 bg-ai-soft p-5"><h2 className="text-base font-semibold">AI-generated meeting outcomes are drafts.</h2><p className="text-sm leading-relaxed">Dovia has organized this meeting into a draft summary, decisions, action items, open questions, and risks. Review and edit everything before confirming the meeting outcome.</p>
      <p className="text-sm text-text-secondary">This is an illustrative mock result, not an analysis of your notes. Groq is not connected. Edits stay on this screen until you confirm; confirmation saves only in this browser.</p>
      {analysis.status === "CONFIRMED" && <p className="text-sm font-medium">Editing a confirmed demo outcome. Confirm again to replace it without duplicating tasks.</p>}
    </Card>
    {error && <p ref={errorRef} tabIndex={-1} role="alert" className="rounded-md bg-danger-soft p-4 text-sm text-danger-foreground">{error}</p>}
    <Tabs label="Review meeting outcome" value={tab} onValueChange={setTab} items={[
      {value:"summary",label:"Summary",content:<Card className="p-5"><Textarea label="Meeting summary" className="min-h-56" value={analysis.summary} onChange={e => patch({summary:e.target.value})} required /></Card>},
      {value:"decisions",label:"Decisions",content:<ReviewListEditor label="Decision" items={analysis.decisions.map(item => ({id:item.id,text:item.description}))} onChange={items => patch({decisions:items.map(item => ({id:item.id,description:item.text}))})} />},
      {value:"actions",label:"Action Items",content:<ActionItemEditor items={analysis.actionItems} onChange={actionItems => patch({actionItems})} />},
      {value:"questions",label:"Open Questions",content:<ReviewListEditor label="Open question" items={analysis.openQuestions.map(item => ({id:item.id,text:item.question}))} onChange={items => patch({openQuestions:items.map(item => ({id:item.id,question:item.text}))})} />},
      {value:"risks",label:"Risks",content:<ReviewListEditor label="Risk" risks items={analysis.risks.map(item => ({id:item.id,text:item.description,severity:item.severity}))} onChange={items => patch({risks:items.map(item => ({id:item.id,description:item.text,severity:item.severity}))})} />},
      {value:"notes",label:"Notes",content:<Card className="p-5"><Textarea label="Important meeting notes" className="min-h-56" helperText="One note per line. These notes are preserved in the confirmed record." value={analysis.importantNotes.join("\n")} onChange={e => patch({importantNotes:e.target.value.split("\n")})} /></Card>},
    ]} />
    <Modal open={confirm} onClose={() => {if (!saving) setConfirm(false);}} title="Confirm meeting outcome?" description="This will mark the reviewed decisions and action items as the confirmed result of this demo meeting." onConfirm={save} confirmLabel="Confirm Outcome" confirmLoading={saving}>
      <p className="text-sm text-text-secondary">{analysis.decisions.length} decisions and {analysis.actionItems.length} reviewed action items will be saved. Existing results for this meeting will be replaced. No backend tasks or notifications are created.</p>
      {error && <p role="alert" className="mt-4 text-sm text-danger-foreground">{error}</p>}
    </Modal>
    {notice && <div className="fixed inset-x-4 bottom-4 z-[var(--z-toast)] sm:left-auto"><Toast variant="info" title="AI regeneration will use Groq when the backend is connected." description="Your current draft has not changed." onDismiss={() => setNotice(false)} /></div>}
  </div>;
}
