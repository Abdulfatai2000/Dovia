"use client";

import { useEffect, useId, useRef, useState, type DragEvent } from "react";
import { useRouter } from "next/navigation";
import { ClipboardList, FileText, Info, PencilLine, Sparkles, UploadCloud, X } from "lucide-react";
import type { MeetingContent, MeetingFile } from "@/types/meeting";
import { getMeetingContent, saveMeetingContent } from "@/services/meeting.service";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IconButton } from "@/components/ui/icon-button";
import { Toast } from "@/components/ui/toast";
import { LoadingState } from "@/components/ui/loading-state";
import { SectionHeader } from "@/components/ui/section-header";
import { cn } from "@/lib/utils";

const mimeTypes: Record<string, string[]> = {
  txt: ["text/plain"], md: ["text/markdown", "text/x-markdown", "text/plain"],
  pdf: ["application/pdf"], docx: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
};
const acceptedFormats = "TXT · MD · DOCX · PDF";
const sizeLimit = "Up to 10 MB";
const placeholder = "Paste your meeting notes or transcript here...";

const modes = [
  { value: "paste", label: "Paste Notes", description: "Paste your meeting notes or transcript", icon: ClipboardList },
  { value: "upload", label: "Upload File", description: "Upload a transcript or document", icon: UploadCloud },
  { value: "manual", label: "Type Manually", description: "Write or edit your notes directly", icon: PencilLine },
] as const satisfies readonly { value: MeetingContent["mode"]; label: string; description: string; icon: typeof ClipboardList }[];

export default function ContentInput({ meetingId }: { meetingId: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<MeetingContent["mode"]>("paste");
  const [text, setText] = useState("");
  const [file, setFile] = useState<MeetingFile>();
  const [error, setError] = useState("");
  const [notice, setNotice] = useState<{ title: string; description: string; variant: "info" | "error" }>();
  const [loading, setLoading] = useState(true);
  const [continuing, setContinuing] = useState(false);
  const upload = useRef<HTMLInputElement>(null);
  const notes = useRef<HTMLTextAreaElement>(null);
  const countId = useId();

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (!active) return;
      try {
        const saved = getMeetingContent(meetingId);
        if (saved) { setMode(saved.mode); setText(saved.text); setFile(saved.file); }
      } catch (cause) {
        setNotice({ variant: "error", title: "Unable to restore demo content", description: cause instanceof Error ? cause.message : "Enter fresh notes below." });
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
      setFile({ id: "selected-file", name: selected.name, size: selected.size, type: extension.toUpperCase() });
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
      } else setNotice({ variant: "info", title: "Demo content saved in this browser.", description: "No content was uploaded or analyzed. Selected files are stored as metadata only." });
    } catch (cause) {
      setNotice({ variant: "error", title: "Demo content not saved", description: cause instanceof Error ? cause.message : "Keep a copy of your notes and try again." });
    }
  }

  if (loading) return <LoadingState label="Loading demo content…" />;

  const notesEditor = (manual: boolean) => <div className="space-y-4">
    <SectionHeader title={manual ? "Write your meeting notes" : "Paste your meeting notes or transcript"}
      description={manual
        ? "Write or refine your meeting notes directly. Manual and paste modes share the same draft."
        : "Copy and paste your meeting notes, transcript, or any raw meeting content into the box below."} />
    <Textarea ref={notes} label={manual ? "Meeting notes" : "Meeting notes or transcript"} hideLabel
      placeholder={placeholder} className="min-h-[22rem] lg:min-h-[24rem]"
      aria-describedby={countId} value={text}
      onChange={event => { setText(event.target.value); setError(""); }} error={error} />
    <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-text-muted">
      <span id={countId}>{text.length} characters</span>
      <span>Accepts pasted text, or {acceptedFormats} via Upload File</span>
    </div>
  </div>;

  const fileInput = <div className="space-y-4">
    <SectionHeader title="Upload a transcript or document" description="Choose a file or drag it into the area below. Nothing is uploaded to a server." />
    <div onDragOver={event => event.preventDefault()} onDrop={drop}
      className="flex min-h-[18rem] flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border-strong bg-surface-soft p-8 text-center">
      <span aria-hidden="true" className="flex size-12 items-center justify-center rounded-default bg-surface text-primary"><UploadCloud className="size-6" /></span>
      <p className="dovia-card-title">Drop your file here</p>
      <p className="text-sm text-text-secondary">or choose a file</p>
      <Input ref={upload} label="Upload meeting file" type="file" accept=".txt,.md,.docx,.pdf" onChange={event => chooseFile(event.target.files?.[0])}
        error={error} className="mx-auto min-h-12 max-w-xs text-xs" />
      <p className="text-xs text-text-muted">Accepted formats: {acceptedFormats} · {sizeLimit}</p>
    </div>
    {file && <div className="flex items-start gap-3 rounded-md border border-border bg-surface p-4">
      <FileText aria-hidden="true" className="mt-1 size-5 shrink-0 text-primary" />
      <div className="min-w-0 flex-1">
        <p className="break-all text-sm font-medium">{file.name}</p>
        <p className="mt-1 text-xs text-text-muted">{file.type} · {((file.size ?? 0) / 1024).toFixed(1)} KB · Metadata only</p>
      </div>
      <IconButton aria-label="Remove selected file" onClick={() => { setFile(undefined); setError(""); }}><X aria-hidden="true" /></IconButton>
    </div>}
  </div>;

  return <div className="space-y-6">
    <fieldset className="min-w-0">
      <legend className="sr-only">Meeting content input mode</legend>
      <div className="grid gap-4 md:grid-cols-3">
        {modes.map(item => {
          const Icon = item.icon;
          const active = mode === item.value;
          return <label key={item.value}
            className={cn("flex cursor-pointer flex-col gap-3 rounded-lg border-b-4 bg-surface p-5 transition-colors duration-200",
              active ? "border-primary bg-surface-hover" : "border-border hover:bg-surface-soft")}>
            <input type="radio" name="content-mode" value={item.value} checked={active}
              onChange={() => { setMode(item.value); setError(""); }}
              className="sr-only" />
            <span aria-hidden="true" className={cn("flex size-10 items-center justify-center rounded-default", active ? "bg-primary text-on-brand" : "bg-surface-soft text-primary")}>
              <Icon className="size-5" />
            </span>
            <span className="block">
              <span className={cn("block text-base font-semibold", active ? "text-primary" : "text-foreground")}>{item.label}</span>
              <span className="mt-1 block text-sm text-text-secondary">{item.description}</span>
            </span>
          </label>;
        })}
      </div>
    </fieldset>

    <Card className="p-[var(--card-padding)]">
      {mode === "paste" ? notesEditor(false) : mode === "upload" ? fileInput : notesEditor(true)}
    </Card>

    <div className="space-y-3">
      <Button variant="gradient" size="lg" className="w-full" loading={continuing} loadingText="Opening review preview…" onClick={() => save(true)}>
        <Sparkles aria-hidden="true" />Generate Meeting Summary
      </Button>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button variant="outline" onClick={() => save(false)}>Save demo draft</Button>
        <p className="text-xs text-text-muted">Next: review an illustrative mock AI draft. No AI generation runs in this demo.</p>
      </div>
    </div>

    <Card className="space-y-3 border-info/20 bg-info-soft p-[var(--card-padding)]">
      <div className="flex items-start gap-3">
        <Info aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-info-foreground" />
        <div className="min-w-0 space-y-1">
          <h2 className="dovia-card-title">Accepted transcript formats</h2>
          <p className="text-sm leading-relaxed text-text-secondary">
            Dovia accepts {acceptedFormats} files up to 10 MB, or text pasted directly into the notes box.
            In this frontend demo the selected file is recorded as metadata only: its contents are never read,
            uploaded, or sent to an AI provider.
          </p>
        </div>
      </div>
    </Card>

    {notice && <div className="fixed inset-x-4 bottom-4 z-[var(--z-toast)] sm:left-auto"><Toast {...notice} onDismiss={() => setNotice(undefined)} /></div>}
  </div>;
}