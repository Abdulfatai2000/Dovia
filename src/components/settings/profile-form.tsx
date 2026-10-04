"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Avatar } from "@/components/ui/avatar";
import { Toast } from "@/components/ui/toast";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { useSettings } from "@/hooks/use-settings";
import { timezones, updateProfileSettings } from "@/services/settings.service";
import type { ProfileSettings } from "@/types/settings";

/** Content only. The surrounding card chrome comes from the settings dashboard/section route. */
export default function ProfileForm() {
  const { data, loading, error } = useSettings();
  const [draft, setDraft] = useState<ProfileSettings | null>(null);
  const [saved, setSaved] = useState(false);
  const [failure, setFailure] = useState("");
  // Avatar preview is intentionally session-only: image data is never written to storage.
  const [photo, setPhoto] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const profile = draft ?? data?.profile;

  if (error) return <ErrorState description={error} />;
  if (loading || !profile) return <LoadingState label="Loading account settings…" />;

  const change = <K extends keyof ProfileSettings>(key: K, value: ProfileSettings[K]) =>
    setDraft(previous => ({ ...(previous ?? profile), [key]: value }));

  function choosePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setFailure("Choose an image file to preview."); return; }
    if (file.size > 2 * 1024 * 1024) { setFailure("Choose an image smaller than 2 MB."); return; }
    setFailure("");
    const reader = new FileReader();
    reader.onload = () => setPhoto(typeof reader.result === "string" ? reader.result : null);
    reader.onerror = () => setFailure("That image could not be previewed. Try a different file.");
    reader.readAsDataURL(file);
  }
  function removePhoto() {
    setPhoto(null);
    if (fileInput.current) fileInput.current.value = "";
  }
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try { updateProfileSettings(profile); setDraft(null); setFailure(""); setSaved(true); }
    catch (cause) { setSaved(false); setFailure(cause instanceof Error ? cause.message : "Unable to save your account settings."); }
  };

  return <>
    <form onSubmit={submit} noValidate className="min-w-0 space-y-5">
      <div className="flex flex-wrap items-center gap-4">
        <Avatar name={profile.name} src={photo ?? undefined} size="xl" alt={profile.name} />
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => fileInput.current?.click()}>
            <ImagePlus aria-hidden="true" />Change Photo
          </Button>
          {photo && <Button variant="ghost" size="sm" onClick={removePhoto}><Trash2 aria-hidden="true" />Remove</Button>}
          <input ref={fileInput} type="file" accept="image/*" className="sr-only" aria-label="Choose a profile photo to preview" onChange={choosePhoto} />
        </div>
      </div>
      <p className="text-xs text-text-muted">Photo preview only. Images are not uploaded, and nothing is stored in this browser.</p>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Full Name" hideLabel={false} required autoComplete="name" value={profile.name}
          onChange={event => change("name", event.target.value)} />
        <Input label="Email Address" hideLabel={false} required type="email" autoComplete="email" value={profile.email}
          onChange={event => change("email", event.target.value)} />
        <Input label="Job Title" hideLabel={false} value={profile.jobTitle} autoComplete="organization-title"
          onChange={event => change("jobTitle", event.target.value)} />
        <Select label="Time Zone" hideLabel={false} value={profile.timezone}
          onChange={event => change("timezone", event.target.value)} options={timezones.map(zone => ({ value: zone, label: zone }))} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit">Save changes</Button>
        <p className="text-xs text-text-muted">Saved in this browser only. No server account is updated.</p>
      </div>
    </form>

    {saved && <div className="fixed right-4 bottom-4 left-4 z-[var(--z-toast)] sm:left-auto">
      <Toast variant="success" title="Account settings updated for demo." description="Saved in this browser only." onDismiss={() => setSaved(false)} />
    </div>}
    {failure && <div className="fixed right-4 bottom-4 left-4 z-[var(--z-toast)] sm:left-auto">
      <Toast variant="error" title="Account settings were not saved." description={failure} onDismiss={() => setFailure("")} />
    </div>}
  </>;
}
