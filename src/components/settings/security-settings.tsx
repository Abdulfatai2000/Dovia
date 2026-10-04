"use client";

import { useState, type FormEvent } from "react";
import { Laptop, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PasswordInput } from "@/components/auth/password-input";
import { Toast } from "@/components/ui/toast";

/** Content only. The surrounding card chrome comes from the settings dashboard/section route. */
export default function SecuritySettings() {
  const [feedback, setFeedback] = useState<{ title: string; description: string } | null>(null);
  const [mismatch, setMismatch] = useState("");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const current = String(form.get("currentPassword") ?? "");
    const next = String(form.get("newPassword") ?? "");
    const confirm = String(form.get("confirmPassword") ?? "");
    if (!current || !next || !confirm) { setMismatch("Complete all three password fields."); return; }
    if (next.length < 8) { setMismatch("Use at least 8 characters for the new password."); return; }
    if (next !== confirm) { setMismatch("New password and confirm password do not match."); return; }
    setMismatch("");
    setFeedback({
      title: "Password changes will be connected during backend authentication.",
      description: "Checked in this form only. No credentials were changed, sent, or persisted.",
    });
    event.currentTarget.reset();
  };

  return <>
    <section className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">Password</h3>
      <p className="text-xs text-text-muted">Password fields are never stored in this browser.</p>
      <form onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
        <PasswordInput id="currentPassword" name="currentPassword" label="Current password" autoComplete="current-password" />
        <PasswordInput id="newPassword" name="newPassword" label="New password" autoComplete="new-password" />
        <PasswordInput id="confirmPassword" name="confirmPassword" label="Confirm password" autoComplete="new-password" error={mismatch} />
        <div className="flex items-start"><Button type="submit">Change Password</Button></div>
      </form>
    </section>

    <section className="mt-6 space-y-3 border-t border-border pt-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <h3 className="text-sm font-semibold text-foreground">Two-Factor Authentication</h3>
          <p className="text-xs text-text-muted">An extra confirmation step when signing in.</p>
          <Badge variant="neutral">Not enabled</Badge>
        </div>
        <Button variant="outline" onClick={() => setFeedback({
          title: "Two-factor authentication will be available when backend authentication is connected.",
          description: "No QR code or secret was generated.",
        })}>
          <ShieldCheck aria-hidden="true" />Enable 2FA
        </Button>
      </div>
    </section>

    <section className="mt-6 space-y-3 border-t border-border pt-5">
      <h3 className="text-sm font-semibold text-foreground">Active Sessions</h3>
      <p className="text-xs text-text-muted">Demo session preview. These rows are illustrative and were not retrieved from a session database.</p>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-default border border-border bg-surface-soft p-4">
        <div className="flex min-w-0 items-center gap-3">
          <Laptop aria-hidden="true" className="size-5 shrink-0 text-text-muted" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">Chrome on Windows</p>
            <p className="text-xs text-text-muted">Demo session preview · This browser</p>
          </div>
        </div>
        <Badge variant="success">Current</Badge>
      </div>
    </section>

    {feedback && <div className="fixed right-4 bottom-4 left-4 z-[var(--z-toast)] sm:left-auto">
      <Toast variant="info" title={feedback.title} description={feedback.description} onDismiss={() => setFeedback(null)} />
    </div>}
  </>;
}
