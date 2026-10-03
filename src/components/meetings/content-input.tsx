"use client";

import { useEffect, useRef, useState, type DragEvent } from "react";
import { useRouter } from "next/navigation";
import { FileText, Sparkles, UploadCloud, X } from "lucide-react";
import type { MeetingContent, MeetingFile } from "@/types/meeting";
import { getMeetingContent, saveMeetingContent } from "@/services/meeting.service";
import { Tabs } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IconButton } from "@/components/ui/icon-button";
import { Toast } from "@/components/ui/toast";
import { LoadingState } from "@/components/ui/loading-state";
import { SectionHeader } from "@/components/ui/section-header";

const mimeTypes: Record<string, string[]> = {
  txt: ["text/plain"], md: ["text/markdown", "text/x-markdown", "text/plain"],
  pdf: ["application/pdf"], docx: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
};
const sample = "We agreed to launch on October 15.\nDavid will integrate the payment API by October 9.\nSarah will prepare the campaign assets.\nWe still need to confirm the domain name.\nThere are issues with the mobile version.";

export default function ContentInput({ meetingId }: { meetingId: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<MeetingContent["mode"]>("paste");
  const [text, setText] = useState("");
  const [file, setFile] = useState<MeetingFile>();
  const [error, setError] = useState("");
  const [notice, setNotice] = useState<{title:string; description:string; variant:"info"|"error"}>();
  const [loading, setLoading] = useState(true);
  const [continuing, setContinuing] = useState(false);
  const upload = useRef<HTMLInputElement>(null);
  const notes = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (!active) return;
      try {
        const saved = getMeetingContent(meetingId);
        if (saved) { setMode(saved.mode); setText(saved.text); setFile(saved.file); }
      } catch (cause) {
        setNotice({ variant:"error", title:"Unable to restore demo content", description:cause instanceof Error ? cause.message : "Enter fresh notes below." });
      } finally { setLoading(false); }
    });
    return () => { active = false; };
  }, [meetingId]);
  function chooseFile(selected?: File) {
    if (!selected) return;
    setFile(undefined);
    const extension = selected.name.split(".").pop()?.toLowerCase() ?? "";
    if (!mimeTypes[extension] || (selected.type && selected.type !== "application/octet-stream" && !mimeTypes[extension].includes(selected.type))) {
      setError("Choose a TXT, MD, DOCX, or PDF file.");
    } else if (selected.size === 0 || selected.size > 10 * 1024 * 1024) {
      setError("Choose a non-empty file no larger than 10 MB.");
    } else {
      setFile({ id:"selected-file", name:selected.name, size:selected.size, type:extension.toUpperCase() });
      setError("");
    }
    if (upload.current) upload.current.value = "";
  }
  function drop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (event.dataTransfer.files.length !== 1) { setFile(undefined); setError("Choose one file at a time."); return; }
    chooseFile(event.dataTransfer.files[0]);
  }
  function save(continueToReview: boolean) {
    if (mode === "upload" ? !file : !text.trim()) {
      setError("Add meeting content before continuing.");
      requestAnimationFrame(() => (mode === "upload" ? upload.current : notes.current)?.focus());
      return;
    }
    try {
      saveMeetingContent(meetingId, { mode, text, file });
      setError("");
      if (continueToReview) {
        setContinuing(true);
        router.push(`/meetings/${meetingId}/ai-review`);
      } else setNotice({ variant:"info", title:"Demo content saved in this browser.", description:"No content was uploaded or analyzed. Selected files are stored as metadata only." });
    } catch (cause) {
      setNotice({ variant:"error", title:"Demo content not saved", description:cause instanceof Error ? cause.message : "Keep a copy of your notes and try again." });
    }
  }
  if (loading) return <LoadingState label="Loading demo content…" />;
  const textInput = (manual: boolean) => <Textarea ref={notes} label={manual ? "Write your meeting notes" : "Paste your meeting notes or transcript"}
    helperText={manual ? "Write or refine your meeting notes directly. Paste and manual modes share the same draft." : "Add your notes in full. Your text stays in this browser when you save or continue."}
    placeholder={sample} className="min-h-80" showCount value={text} onChange={e => {setText(e.target.value);setError("");}} error={error} />;
  const fileInput = <div className="space-y-4">
    <div onDragOver={e => e.preventDefault()} onDrop={drop} className="space-y-4 rounded-lg border-2 border-dashed border-border-strong bg-surface-soft p-5 sm:p-8">
      <UploadCloud aria-hidden="true" className="size-9 text-primary" /><h3 className="dovia-card-title">Drop a file here or choose a file</h3>
      <Input ref={upload} label="Upload meeting file" type="file" accept=".txt,.md,.docx,.pdf" onChange={e => chooseFile(e.target.files?.[0])} error={error}
        helperText="TXT, MD, DOCX, PDF · Up to 10 MB. Metadata preview only; file contents are not read or uploaded." className="min-h-12 min-w-0 max-w-full text-xs" />
    </div>
    {file && <div className="flex items-start gap-3 rounded-md border border-border p-4"><FileText aria-hidden="true" className="mt-1 size-5 shrink-0 text-primary" /><div className="min-w-0 flex-1"><p className="break-all text-sm font-medium">{file.name}</p><p className="mt-1 text-xs text-text-muted">{file.type} · {((file.size ?? 0) / 1024).toFixed(1)} KB · Metadata only</p></div><IconButton aria-label="Remove selected file" onClick={() => {setFile(undefined);setError("");}}><X aria-hidden="true" /></IconButton></div>}
    <p className="text-sm text-text-muted">Continuing previews the next screen with this file reference. Parsing and analysis are not connected.</p>
  </div>;
  return <div className="space-y-6">
    <Card className="p-4 sm:p-6"><Tabs label="Meeting content input mode" value={mode} onValueChange={value => {setMode(value as MeetingContent["mode"]);setError("");}}
      items={[{value:"paste",label:"Paste Notes",content:mode === "paste" ? textInput(false) : null}, {value:"upload",label:"Upload File",content:mode === "upload" ? fileInput : null}, {value:"manual",label:"Type Manually",content:mode === "manual" ? textInput(true) : null}]} />
      {error && <p role="alert" className="mt-4 text-sm text-danger-foreground">{error}</p>}
      <div className="mt-6 flex flex-wrap gap-3 border-t border-border pt-5"><Button variant="gradient" loading={continuing} loadingText="Opening review preview…" onClick={() => save(true)}><Sparkles aria-hidden="true" />Generate Meeting Summary</Button><Button variant="outline" onClick={() => save(false)}>Save demo draft</Button></div>
      <p className="mt-3 text-xs text-text-muted">Next: review an illustrative mock AI draft. No AI generation runs in this demo.</p>
    </Card>
    <Card className="space-y-4 border-ai/20 bg-ai-soft p-5"><SectionHeader title="What Dovia will identify" />
      <ul className="grid list-inside list-disc gap-2 text-sm text-text-secondary sm:grid-cols-2">{["Meeting summary","Key decisions","Action items","Suggested owners","Suggested deadlines","Open questions","Risks and blockers"].map(item => <li key={item}>{item}</li>)}</ul>
      <p className="text-sm font-medium">You&apos;ll review the result before anything becomes final.</p>
      <p className="text-sm text-text-secondary">AI suggestions will be reviewed before being confirmed as meeting outcomes.</p>
    </Card>
    {notice && <div className="fixed inset-x-4 bottom-4 z-[var(--z-toast)] sm:left-auto"><Toast {...notice} onDismiss={() => setNotice(undefined)} /></div>}
  </div>;
}

