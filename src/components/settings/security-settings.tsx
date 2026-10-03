"use client";

import { useState, type FormEvent } from "react";
import { Laptop, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/auth/password-input";
import { Badge } from "@/components/ui/badge";
import { Toast } from "@/components/ui/toast";

export default function SecuritySettings() {
  const [feedback, setFeedback] = useState<{ variant: "info" | "error"; title: string; description: string } | null>(null);
  const [mismatch, setMismatch] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const current = String(form.get("currentPassword") ?? "");
    const next = String(form.get("newPassword") ?? "");
    const confirm = String(form.get("confirmPassword") ?? "");
    if (!current || !next || !confirm) { setMismatch("Complete all three password fields."); return; }
    if (next !== confirm) { setMismatch("New password and confirm password do not match."); return; }
    setMismatch("");
    setFeedback({ variant: "info", title: "Password changes will be connected during backend authentication.", description: "No credentials were read, changed, or stored by this demo." });
    event.currentTarget.reset();
  }

  return <div className="min-w-0 space-y-6">
    <PageHeader title="Security" description="Preview of the account security surfaces. Nothing here changes a real credential." />

    <Card className="p-[var(--card-padding)]">
      <h2 className="dovia-card-title">Change Password</h2>
      <p className="mt-1 text-sm text-text-secondary">Password fields are never stored in this browser.</p>
      <form onSubmit={submit} noValidate className="mt-5 grid max-w-md gap-4">
        <PasswordInput id="currentPassword" name="currentPassword" label="Current password" autoComplete="current-password" />
        <PasswordInput id="newPassword" name="newPassword" label="New password" autoComplete="new-password" />
        <PasswordInput id="confirmPassword" name="confirmPassword" label="Confirm password" autoComplete="new-password" error={mismatch} />
        <div><Button type="submit">Update password</Button></div>
      </form>
    </Card>

    <Card className="p-[var(--card-padding)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <h2 className="dovia-card-title">Two-Factor Authentication</h2>
          <p className="text-sm text-text-secondary">An extra confirmation step when signing in.</p>
          <p className="pt-1"><Badge variant="neutral">Not enabled</Badge></p>
        </div>
        <Button variant="outline" onClick={() => setFeedback({ variant: "info", title: "Two-factor authentication will be available when backend authentication is connected.", description: "No QR code or secret was generated." })}>
          <ShieldCheck aria-hidden="true" />Enable 2FA
        </Button>
      </div>
    </Card>

    <Card className="p-[var(--card-padding)]">
      <h2 className="dovia-card-title">Active Sessions</h2>
      <p className="mt-1 text-sm text-text-secondary">Demo session preview. These rows are illustrative and were not retrieved from a session database.</p>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-default border border-border bg-surface-soft p-4">
        <div className="flex min-w-0 items-center gap-3">
          <Laptop aria-hidden="true" className="size-5 shrink-0 text-text-muted" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">Chrome on Windows</p>
            <p className="text-xs text-text-muted">Demo session preview · This browser</p>
          </div>
        </div>
        <Badge variant="success">Current</Badge>
      </div>
    </Card>

    {feedback && <div className="fixed right-4 bottom-4 left-4 z-[var(--z-toast)] sm:left-auto">
      <Toast variant={feedback.variant} title={feedback.title} description={feedback.description} onDismiss={() => setFeedback(null)} />
    </div>}
  </div>;
}