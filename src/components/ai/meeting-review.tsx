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
import { AIProcessingState } from "./ai-processing-state";
import { AI_ENABLED } from "@/services/ai.service";
import { formatDate } from "@/lib/meeting-format";
import ReviewListEditor from "./review-list-editor";
import ActionItemEditor from "./action-item-editor";

export default function MeetingReview({ meetingId }: { meetingId: string }) {
  const router = useRouter();
  const { meetings, loading, error: meetingError } = useMeetings();
  const { analysis, setAnalysis, error: analysisError, loading: analysisLoading, processing, generate, reload } = useMeetingAnalysis(meetingId);
  const [tab,setTab] = useState("summary");
  const [confirm,setConfirm] = useState(false);
  const [saving,setSaving] = useState(false);
  const [error,setError] = useState("");
  const [notice,setNotice] = useState(false);
  const errorRef = useRef<HTMLParagraphElement>(null);
  const meeting = meetings.find(item => item.id === meetingId);
  if (meetingError) return <MeetingNotFound error={meetingError} />;
  if (loading || analysisLoading) return <MeetingLoading />;
  if (!meeting) return <MeetingNotFound />;
  if (processing) return <div className="space-y-4"><AIProcessingState state="processing" step={1} /><Button variant="outline" onClick={()=>void reload()}>Refresh analysis status</Button></div>;
  if (!analysis) return <div className="space-y-5"><PageHeader title={meeting.title} eyebrow="Meeting analysis" /><AIProcessingState state={analysisError?"error":"idle"} errorMessage={analysisError} />{AI_ENABLED?<Button variant="gradient" onClick={()=>void generate()}>Analyze Meeting</Button>:<p className="text-sm text-text-secondary">Meeting AI is currently disabled.</p>}<ButtonLink href={`/meetings/${meetingId}/content`} variant="outline">Edit meeting content</ButtonLink><Button variant="ghost" onClick={()=>void reload()}>Reload saved analysis</Button></div>;
  if (analysis.status === "CONFIRMED") return <div className="space-y-5"><PageHeader title={meeting.title} eyebrow="Confirmed outcome" /><Card className="space-y-4 p-5"><Badge variant="success">Confirmed</Badge><p className="whitespace-pre-wrap text-sm">{analysis.summary}</p><p className="text-sm text-text-secondary">This outcome is final. Its decisions and tasks are saved to your workspace.</p></Card><ButtonLink href={`/meetings/${meetingId}`}>View confirmed meeting</ButtonLink><ButtonLink href={`/meetings/${meetingId}/follow-up`} variant="outline">View follow-up tasks</ButtonLink></div>;
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
  async function save() {
    if (!analysis || saving) return;
    setSaving(true);
    try { await confirmMeetingOutcome(analysis); router.push(`/meetings/${meetingId}`); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to save outcome."); setSaving(false); }
  }
  const patch = (value: Partial<typeof analysis>) => setAnalysis({...analysis,...value});
  return <div className="space-y-6">
    <PageHeader title={meeting.title} eyebrow="Review workspace" breadcrumbs={<ButtonLink href={`/meetings/${meetingId}`} variant="ghost" size="sm">← Back to Meeting</ButtonLink>}
      actions={<><Button variant="outline" disabled={!AI_ENABLED || saving} onClick={() => setNotice(true)}><RotateCcw aria-hidden="true" />Regenerate</Button><Button variant="gradient" onClick={requestConfirmation}><Check aria-hidden="true" />Confirm Meeting Outcome</Button></>} />
<div className="flex flex-wrap items-center gap-3 text-sm text-text-secondary"><Badge variant="ai"><Sparkles aria-hidden="true" />AI Meeting Summary</Badge><span>{meeting.platform} · {formatDate(meeting.date)} · {meeting.duration} min · {meeting.participants.length} participants</span></div>
    <Card className="dovia-glass relative overflow-hidden border-ai/25 bg-gradient-to-br from-ai-soft via-surface/80 to-pink-soft/70 p-5 shadow-glow-ai">
      <span aria-hidden="true" className="dovia-orb dovia-gradient-ai pointer-events-none absolute -top-16 -right-10 size-56 rounded-pill opacity-25 blur-3xl" />
      <h2 className="relative flex items-center gap-2 text-base font-semibold"><span aria-hidden="true" className="dovia-gradient-ai flex size-8 items-center justify-center rounded-default text-on-brand shadow-sm"><Sparkles className="size-4" /></span>AI-generated meeting outcomes are drafts.</h2>
      <p className="relative mt-3 text-sm leading-relaxed">Dovia has organized this meeting into a draft summary, decisions, action items, open questions, and risks. Review and edit everything before confirming the meeting outcome.</p>
      <p className="relative mt-2 text-sm text-text-secondary">This draft was generated from your saved meeting content. Review every suggestion. Edits stay on this screen until confirmation creates workspace decisions and tasks.</p>
    </Card>
    {(error || analysisError) && <p ref={errorRef} tabIndex={-1} role="alert" className="rounded-md bg-danger-soft p-4 text-sm text-danger-foreground">{error || analysisError}</p>}
    <Tabs label="Review meeting outcome" value={tab} onValueChange={setTab} items={[
      {value:"summary",label:"Summary",content:<Card className="p-5"><Textarea label="Meeting summary" className="min-h-56" value={analysis.summary} onChange={e => patch({summary:e.target.value})} required /></Card>},
      {value:"decisions",label:"Decisions",content:<ReviewListEditor label="Decision" items={analysis.decisions.map(item => ({id:item.id,text:item.description}))} onChange={items => patch({decisions:items.map(item => ({id:item.id,description:item.text}))})} />},
      {value:"actions",label:"Action Items",content:<ActionItemEditor items={analysis.actionItems} onChange={actionItems => patch({actionItems})} />},
      {value:"questions",label:"Open Questions",content:<ReviewListEditor label="Open question" items={analysis.openQuestions.map(item => ({id:item.id,text:item.question}))} onChange={items => patch({openQuestions:items.map(item => ({id:item.id,question:item.text}))})} />},
      {value:"risks",label:"Risks",content:<ReviewListEditor label="Risk" risks items={analysis.risks.map(item => ({id:item.id,text:item.description,severity:item.severity}))} onChange={items => patch({risks:items.map(item => ({id:item.id,description:item.text,severity:item.severity}))})} />},
      {value:"notes",label:"Notes",content:<Card className="p-5"><Textarea label="Important meeting notes" className="min-h-56" helperText="One note per line. These notes are preserved in the confirmed record." value={analysis.importantNotes.join("\n")} onChange={e => patch({importantNotes:e.target.value.split("\n")})} /></Card>},
    ]} />
    <Modal open={confirm} onClose={() => {if (!saving) setConfirm(false);}} title="Confirm meeting outcome?" description="This will mark the reviewed decisions and action items as the confirmed result of this meeting." onConfirm={save} confirmLabel="Confirm Outcome" confirmLoading={saving}>
      <p className="text-sm text-text-secondary">{analysis.decisions.length} decisions and {analysis.actionItems.length} reviewed action items will be saved. Decisions, tasks and relevant notifications will be created together. Retrying will not duplicate them.</p>
      {error && <p role="alert" className="mt-4 text-sm text-danger-foreground">{error}</p>}
    </Modal>
    <Modal open={notice} onClose={()=>setNotice(false)} title="Regenerate this draft?" description="Your unsaved edits will be replaced by a new analysis of the saved meeting content." confirmLabel="Regenerate" onConfirm={()=>{setNotice(false);void generate(true);}}><p className="text-sm text-text-secondary">Confirmed outcomes cannot be regenerated.</p></Modal>
  </div>;
}
