"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { AuthCard } from "./auth-card";
import { AuthNotice, type AuthNoticeValue } from "./auth-notice";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Input } from "@/components/ui/input";

export function EmailVerificationForm() {
  const search = useSearchParams();
  const initialEmail = search.get("email") || "";
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [verified, setVerified] = useState(false);
  const [notice, setNotice] = useState<AuthNoticeValue | null>(null);
  const [resendIn, setResendIn] = useState(0);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!initialEmail) return;
    const timer = window.setInterval(() => setResendIn(current => (current > 0 ? current - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, [initialEmail]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || verified) return;
    const code = digits.join("");
    if (!/^\d{6}$/.test(code)) {
      setError("Enter the 6-digit verification code.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: initialEmail, code }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error?.message || "Verification failed.");
        return;
      }
      setVerified(true);
      setError("");
    } catch {
      setError("Unable to verify. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function resend() {
    if (busy || resendIn > 0 || !initialEmail) return;
    setBusy(true);
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: initialEmail }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setNotice({ title: "Unable to resend code.", description: json.error?.message || "Please try again later." });
        return;
      }
      setResendIn(json.data?.resendAvailableInSeconds ?? 60);
      setDigits(Array(6).fill(""));
      setError("");
      setNotice({ title: "Verification email sent.", description: "Check your inbox for the new code." });
      inputs.current[0]?.focus();
    } catch {
      setNotice({ title: "Unable to resend code.", description: "Please try again later." });
    } finally {
      setBusy(false);
    }
  }

  if (verified) {
    return <AuthCard title="Email verified successfully." description="Your account is now active.">
      <p role="status" className="text-sm text-success-foreground">Redirecting to sign in…</p>
      <ButtonLink href="/login">Continue to Sign In</ButtonLink>
    </AuthCard>;
  }

  if (!initialEmail) {
    return <AuthCard title="Verify your email" description="We could not find a pending verification request.">
      <ButtonLink href="/signup">Return to Sign Up</ButtonLink>
    </AuthCard>;
  }

  return <><AuthCard title="Verify your email" description={`Enter the 6-digit verification code for ${initialEmail}.`}>
    <form onSubmit={submit} noValidate className="space-y-4">
      <fieldset disabled={busy} aria-describedby="verification-error verification-timer" className="min-w-0 space-y-3">
        <legend className="mb-3 text-sm font-medium">Verification code</legend>
        <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
          {digits.map((digit, index) => <Input key={index} ref={node => { inputs.current[index] = node; }}
            label={`Verification digit ${index + 1} of 6`} hideLabel inputMode="numeric" pattern="[0-9]*"
            autoComplete="one-time-code" value={digit} maxLength={1}
            className="px-0 text-center text-lg tabular-nums"
            aria-invalid={Boolean(error)} aria-describedby={error ? "verification-error" : undefined}
            onChange={event => {
              const value = event.target.value.replace(/\D/g, "").slice(-1);
              setError("");
              const next = [...digits];
              next[index] = value;
              setDigits(next);
              if (value && index < 5) inputs.current[index + 1]?.focus();
              if (index === 5 && value) inputs.current[5]?.blur();
            }}
            onFocus={event => event.target.select()}
            onPaste={event => {
              event.preventDefault();
              const pasted = event.clipboardData.getData("text").trim().replace(/\D/g, "").slice(0, 6);
              if (pasted.length === 6) {
                setDigits(pasted.split(""));
                inputs.current[5]?.focus();
              }
            }}
            onKeyDown={event => {
              if (event.key === "Backspace") {
                event.preventDefault();
                const target = !digits[index] && index > 0 ? index - 1 : index;
                setDigits(current => current.map((old, i) => i === target ? "" : old));
                inputs.current[target]?.focus();
              }
              if (event.key === "ArrowLeft") { event.preventDefault(); inputs.current[Math.max(0, index - 1)]?.focus(); }
              if (event.key === "ArrowRight") { event.preventDefault(); inputs.current[Math.min(5, index + 1)]?.focus(); }
            }}
          />)}
        </div>
      </fieldset>
      <p id="verification-timer" className="text-sm text-text-secondary tabular-nums">Code expires in 2:00</p>
      <p id="verification-error" role="alert" className="text-sm text-danger-foreground">{error}</p>
      <Button type="submit" variant="gradient" className="w-full" disabled={busy || verified}>Verify Email</Button>
    </form>
    <div className="flex flex-wrap items-center justify-between gap-3">
      <Button variant="ghost" onClick={resend} disabled={resendIn > 0 || busy}>{resendIn > 0 ? `Resend code in ${resendIn}s` : "Resend Code"}</Button>
      <ButtonLink href="/signup" variant="ghost">Change Email</ButtonLink>
    </div>
  </AuthCard><AuthNotice notice={notice} onDismiss={() => setNotice(null)} /></>;
}
