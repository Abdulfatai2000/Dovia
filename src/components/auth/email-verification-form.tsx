"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AuthCard } from "./auth-card";
import { AuthNotice, type AuthNoticeValue } from "./auth-notice";
import { authErrorMessages, AuthValidationError, type AuthErrorCode } from "./auth-errors";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Input } from "@/components/ui/input";
import { LoadingState } from "@/components/ui/loading-state";
import { getPendingVerification, maskEmail, resendDemoCode, verificationBlock, verifyDemoCode, MAX_OTP_ATTEMPTS, type DemoVerification } from "@/services/auth-verification.service";

export function EmailVerificationForm() {
  const router = useRouter();
  const [pending, setPending] = useState<DemoVerification | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [now, setNow] = useState(0);
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState("");
  const [errorCode, setErrorCode] = useState<AuthErrorCode>();
  const [busy, setBusy] = useState(false);
  const [verified, setVerified] = useState(false);
  const [notice, setNotice] = useState<AuthNoticeValue | null>(null);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (!active) return;
      try { setPending(getPendingVerification()); } catch (cause) { setError((cause as Error).message); }
      setNow(Date.now()); setLoaded(true);
    });
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => { active = false; clearInterval(timer); };
  }, []);
  useEffect(() => {
    if (!verified) return;
    // Allow the success announcement to be read before leaving; this is not a network delay.
    const timer = window.setTimeout(() => router.replace("/login"), 2000);
    return () => clearTimeout(timer);
  }, [verified, router]);
  const blocked = pending ? verificationBlock(pending, now) : undefined;
  const seconds = pending ? Math.max(0, Math.ceil((pending.expiresAt - now) / 1000)) : 0;
  const cooldown = pending ? Math.max(0, Math.ceil((pending.resendAt - now) / 1000)) : 0;
  const message = blocked ? authErrorMessages[blocked] : error;
  function failure(cause: unknown) {
    setError(cause instanceof Error ? cause.message : "Unable to complete demo verification.");
    setErrorCode(cause instanceof AuthValidationError ? cause.code : undefined);
    try { setPending(getPendingVerification()); } catch { /* Keep the displayed storage error. */ }
    setNow(Date.now());
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy || verified) return;
    try { verifyDemoCode(digits.join("")); setVerified(true); setError(""); }
    catch (cause) { failure(cause); inputs.current[digits.findIndex(digit => !digit) >= 0 ? digits.findIndex(digit => !digit) : 0]?.focus(); }
  }
  async function resend() {
    if (busy) return;
    setBusy(true);
    try {
      await Promise.resolve();
      setPending(resendDemoCode()); setNow(Date.now()); setDigits(Array(6).fill("")); setError(""); setErrorCode(undefined);
      setNotice({ title: "A new verification code has been generated for this demo.", description: "The previous code is invalid. No email was sent." });
      requestAnimationFrame(() => inputs.current[0]?.focus());
    } catch (cause) { failure(cause); } finally { setBusy(false); }
  }
  function enter(value: string, index: number) {
    if (!/^\d*$/.test(value)) return;
    setError(""); setErrorCode(undefined);
    if (value.length === 6) { setDigits(value.split("")); inputs.current[5]?.focus(); return; }
    const digit = value.slice(-1);
    setDigits(current => current.map((old, i) => i === index ? digit : old));
    if (digit && index < 5) inputs.current[index + 1]?.focus();
  }
  if (!loaded) return <LoadingState label="Loading verification request…" />;
  if (verified) return <AuthCard title="Email verified successfully." description="Demo verification complete. No account or authenticated session was created.">
    <p role="status" className="text-sm text-success-foreground">Redirecting to sign in…</p><ButtonLink href="/login">Continue to Sign In</ButtonLink>
  </AuthCard>;
  if (!pending) return <AuthCard title="Verify your email" description="No email verification request was found.">
    {error && <p role="alert" className="text-sm text-danger-foreground">{error}</p>}<ButtonLink href="/signup">Return to Sign Up</ButtonLink>
  </AuthCard>;
  return <><AuthCard title="Verify your email" description={`Enter the 6-digit demo verification code for ${maskEmail(pending.email)}.`}>
    <p className="rounded-default border border-border bg-surface-soft p-3 text-sm text-text-secondary">Frontend demo only. No email was sent. Use demo code <strong className="font-mono tracking-widest text-foreground">{pending.demoCode}</strong>.</p>
    <form onSubmit={submit} noValidate className="space-y-4">
      <fieldset disabled={busy || Boolean(blocked)} aria-describedby="verification-error verification-timer" className="min-w-0 space-y-3">
        <legend className="mb-3 text-sm font-medium">Verification code</legend>
        <div className="grid grid-cols-6 gap-1.5 sm:gap-2">{digits.map((digit, index) => <Input key={index} ref={node => { inputs.current[index] = node; }}
          label={`Verification digit ${index + 1} of 6`} hideLabel inputMode="numeric" pattern="[0-9]*" autoComplete={index === 0 ? "one-time-code" : "off"}
          value={digit} maxLength={6} className="px-0 text-center text-lg tabular-nums" aria-invalid={Boolean(message)} aria-describedby={message ? "verification-error" : undefined}
          onChange={event => enter(event.target.value, index)} onFocus={event => event.target.select()}
          onPaste={event => { event.preventDefault(); const pasted = event.clipboardData.getData("text").trim(); if (/^\d{6}$/.test(pasted)) enter(pasted, 0); }}
          onKeyDown={event => {
            if (event.key === "Backspace") { event.preventDefault(); const target = !digit && index > 0 ? index - 1 : index; setDigits(current => current.map((old, i) => i === target ? "" : old)); inputs.current[target]?.focus(); }
            if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); inputs.current[Math.max(0, Math.min(5, index + (event.key === "ArrowLeft" ? -1 : 1)))]?.focus(); }
          }} />)}</div>
      </fieldset>
      <p id="verification-timer" className="text-sm text-text-secondary tabular-nums">Code expires in {String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}</p>
      <p className="text-xs text-text-muted">{MAX_OTP_ATTEMPTS - pending.attempts} attempts remaining</p>
      <p id="verification-error" role="alert" data-error-code={blocked ?? errorCode} className="text-sm text-danger-foreground">{message}</p>
      <Button type="submit" variant="gradient" className="w-full" disabled={Boolean(blocked) || busy}>Verify Email</Button>
    </form>
    <div className="flex flex-wrap items-center justify-between gap-3"><Button variant="ghost" onClick={resend} disabled={cooldown > 0} loading={busy}>{cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend Code"}</Button><ButtonLink href="/signup" variant="ghost">Change Email</ButtonLink></div>
  </AuthCard><AuthNotice notice={notice} onDismiss={() => setNotice(null)} /></>;
}
