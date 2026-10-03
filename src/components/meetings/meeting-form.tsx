"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Plus, Users } from "lucide-react";
import { users } from "@/data/mock/users";
import { meetingTypes, platforms, teams } from "@/data/mock/meetings";
import { createMeeting } from "@/services/meeting.service";
import { PageHeader } from "@/components/ui/page-header";
import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Toast } from "@/components/ui/toast";
import { formatDate, formatTime } from "@/lib/meeting-format";

const initial = { title: "", date: "", startTime: "", duration: "45", meetingType: "", team: "", platform: "Google Meet", agenda: "", description: "" };
const options = (values: string[]) => values.map(value => ({ value, label: value }));

export default function MeetingForm() {
  const router = useRouter();
  const form = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState(initial);
  const [participants, setParticipants] = useState<string[]>([]);
  const [invitations, setInvitations] = useState(false);
  const [recurring, setRecurring] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const update = (key: keyof typeof initial, value: string) => {
    setValues(current => ({ ...current, [key]: value }));
    setErrors(current => { const next = { ...current }; delete next[key]; return next; });
  };
  const agendaLines = values.agenda.split("\n").map(line => line.trim()).filter(Boolean);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: Record<string,string> = {};
    if (!values.title.trim()) next.title = "Enter a meeting title.";
    if (!values.date || Number.isNaN(Date.parse(values.date))) next.date = "Choose a valid date.";
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(values.startTime)) next.startTime = "Choose a valid time.";
    if (!values.duration || Number(values.duration) < 5 || Number(values.duration) > 480) next.duration = "Choose a duration between 5 and 480 minutes.";
    if (!values.meetingType) next.meetingType = "Choose a meeting type.";
    if (!participants.length) next.participants = "Select at least one participant.";
    setErrors(next);
    if (Object.keys(next).length) {
      requestAnimationFrame(() => {
        const name = Object.keys(next)[0];
        const field = name === "participants" ? document.getElementById("participant-user-sarah") : form.current?.elements.namedItem(name);
        if (field instanceof HTMLElement) field.focus();
      });
      return;
    }
    setSaving(true);
    try {
      const meeting = createMeeting({
        title: values.title.trim(), description: values.description.trim(), date: values.date, startTime: values.startTime,
        duration: Number(values.duration), meetingType: values.meetingType, platform: values.platform, team: values.team,
        participants: [{ userId: "user-abdulfatai", organizer: true }, ...participants.map(userId => ({ userId }))],
        agenda: agendaLines.map((title,index) => ({ id: `agenda-${index + 1}`, title })), files: [], carryOver: [],
        sendInvitations: invitations, recurring,
      });
      router.push(`/meetings/${meeting.id}?created=1`);
    } catch (cause) {
      setNotice(cause instanceof Error ? cause.message : "Unable to create the demo meeting.");
      setSaving(false);
    }
  }
  return <div className="space-y-6">
    <PageHeader title="Create New Meeting" description="Schedule a meeting and bring your team together." breadcrumbs={<ButtonLink href="/meetings" variant="ghost" size="sm">← Back to Meetings</ButtonLink>} />
    <p className="text-sm text-text-muted">Demo only · Saved in this browser. No invitations, calendar events, or meeting links will be created.</p>
    <form ref={form} noValidate onSubmit={submit} className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
      <Card className="space-y-6 p-4 md:p-6">
        <SectionHeader title="Meeting details" description="Give your conversation a clear purpose." />
        {Object.keys(errors).length > 0 && <p role="alert" className="rounded-default bg-danger-soft p-3 text-sm text-danger-foreground">Please check the highlighted fields below.</p>}
        <Input name="title" label="Meeting Title" required placeholder="e.g. Product Strategy Sync" value={values.title} onChange={e => update("title",e.target.value)} error={errors.title} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input name="date" label="Date" type="date" required value={values.date} onChange={e => update("date",e.target.value)} error={errors.date} />
          <Input name="startTime" label="Time" type="time" required value={values.startTime} onChange={e => update("startTime",e.target.value)} error={errors.startTime} />
          <Select name="duration" label="Duration" required value={values.duration} onChange={e => update("duration",e.target.value)} error={errors.duration} options={[15,30,45,60,90,120].map(n => ({value:String(n),label:`${n} minutes`}))} />
          <Select name="meetingType" label="Meeting Type" required placeholder="Select a type" value={values.meetingType} onChange={e => update("meetingType",e.target.value)} error={errors.meetingType} options={options(meetingTypes)} />
          <Select label="Platform" value={values.platform} onChange={e => update("platform",e.target.value)} options={options(platforms)} helperText="Platform label only; no integration is connected." />
          <Select label="Team / Project" value={values.team} onChange={e => update("team",e.target.value)} options={[{value:"",label:"No team selected"}, ...options(teams)]} />
        </div>
        <fieldset aria-describedby={errors.participants ? "participants-error" : "participants-help"} className="space-y-3">
          <legend className="text-sm font-medium">Participants <span aria-hidden="true" className="text-danger-foreground">*</span></legend>
          <p id="participants-help" className="text-sm text-text-muted">You are the organizer. Select at least one teammate.</p>
          <div className="grid gap-2 sm:grid-cols-2">{users.filter(user => user.id !== "user-abdulfatai").map(user => <div key={user.id} className="flex items-start gap-2 rounded-md border border-border p-3">
            <Avatar name={user.name} size="sm" className="mt-1.5" />
            <Checkbox id={`participant-${user.id}`} label={user.name} helperText={user.role} checked={participants.includes(user.id)}
              aria-invalid={Boolean(errors.participants)} aria-describedby={errors.participants ? "participants-error" : undefined}
              onChange={e => { setParticipants(current => e.target.checked ? [...current,user.id] : current.filter(id => id !== user.id)); setErrors(current => { const next = {...current}; delete next.participants; return next; }); }} />
          </div>)}</div>
          {errors.participants && <p id="participants-error" className="text-sm text-danger-foreground">{errors.participants}</p>}
        </fieldset>
        <Textarea label="Agenda" placeholder={"1. Review current progress\n2. Discuss launch blockers\n3. Assign next steps"} helperText="Add one agenda item per line." value={values.agenda} onChange={e => update("agenda",e.target.value)} />
        <Textarea label="Description (optional)" placeholder="What should your team achieve in this meeting?" value={values.description} onChange={e => update("description",e.target.value)} />
        <div className="flex flex-wrap gap-3 border-t border-border pt-5"><Button type="submit" loading={saving} loadingText="Opening demo meeting…"><Plus aria-hidden="true" />Create Meeting</Button><ButtonLink href="/meetings" variant="outline">Cancel</ButtonLink></div>
      </Card>
      <aside className="min-w-0 space-y-5" aria-label="Meeting options and preview">
        <Card className="space-y-4 p-5"><SectionHeader title="Meeting options" />
          <Checkbox label="Send calendar invitations" helperText="Demo preference only. No invitations will be sent." checked={invitations} onChange={e => setInvitations(e.target.checked)} />
          <Checkbox label="Make recurring" helperText="Demo preference only. No occurrences will be generated." checked={recurring} onChange={e => setRecurring(e.target.checked)} />
          {recurring && <dl className="grid grid-cols-2 gap-2 rounded-md bg-surface-soft p-4 text-sm"><dt>Repeat</dt><dd>Weekly</dd><dt>Every</dt><dd>1 week</dd><dt>Ends</dt><dd>Never</dd></dl>}
        </Card>
        <Card className="space-y-4 p-5"><SectionHeader title="Preview" /><div className="flex size-11 items-center justify-center rounded-md bg-ai-soft text-ai"><CalendarDays aria-hidden="true" /></div>
          <h3 className="dovia-card-title">{values.title || "Your meeting title"}</h3>
          <dl className="space-y-3 text-sm text-text-secondary"><div><dt className="text-xs text-text-muted">When</dt><dd>{values.date ? formatDate(values.date) : "Choose a date"} · {values.startTime ? formatTime(values.startTime) : "Choose a time"}</dd></div>
            <div><dt className="text-xs text-text-muted">Where</dt><dd>{values.platform} · {values.team || "No team selected"}</dd></div></dl>
          <p className="flex items-center gap-2 text-sm"><Users aria-hidden="true" className="size-4 text-primary" />{participants.length + 1} participants, including you</p>
          <p className="text-sm text-text-muted">{agendaLines.length} agenda items · {values.duration} minutes</p>
        </Card>
      </aside>
    </form>
    {notice && <div className="fixed inset-x-4 bottom-4 z-[var(--z-toast)] sm:left-auto"><Toast variant="error" title="Demo meeting not saved" description={notice} onDismiss={() => setNotice("")} /></div>}
  </div>;
}
