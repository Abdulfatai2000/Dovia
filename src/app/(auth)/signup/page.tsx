"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { ArrowRight, Check, Eye, EyeOff, ListChecks, MessageSquareText, Users } from "lucide-react";
import { Brand } from "@/components/layout/brand";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Toast } from "@/components/ui/toast";

type FieldName = "fullName" | "email" | "password" | "confirmPassword" | "terms";
type FormErrors = Partial<Record<FieldName, string>>;

function validate(form: HTMLFormElement): FormErrors {
  const data = new FormData(form);
  const errors: FormErrors = {};
  const email = String(data.get("email") ?? "").trim();
  const emailInput = form.elements.namedItem("email");
  const password = String(data.get("password") ?? "");
  if (!String(data.get("fullName") ?? "").trim()) errors.fullName = "Enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || (emailInput instanceof HTMLInputElement && emailInput.validity.typeMismatch)) {
    errors.email = "Enter a valid work email address.";
  }
  if (password.length < 8) errors.password = "Use at least 8 characters for your password.";
  if (!data.get("confirmPassword")) errors.confirmPassword = "Confirm your password.";
  else if (data.get("confirmPassword") !== password) errors.confirmPassword = "Your passwords do not match.";
  if (!data.has("terms")) errors.terms = "Agree to the terms to continue.";
  return errors;
}

function PasswordField({ name, label, error, helperText }: { name: "password" | "confirmPassword"; label: string; error?: string; helperText?: string }) {
  const [visible, setVisible] = useState(false);
  return <div className="relative min-w-0">
    <Input id={name} name={name} label={label} type={visible ? "text" : "password"} autoComplete="new-password" required minLength={8}
      placeholder={name === "password" ? "Create a password" : "Re-enter your password"} error={error} helperText={helperText} className="pr-12" />
    <IconButton size="sm" className="absolute top-8 right-1" aria-label={`${visible ? "Hide" : "Show"} ${label.toLowerCase()}`} aria-controls={name}
      onClick={() => setVisible(!visible)}>{visible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}</IconButton>
  </div>;
}

export default function SignupPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [notice, setNotice] = useState<{ title: string; description: string } | null>(null);
  const [noticeVersion, setNoticeVersion] = useState(0);

  function showNotice(title: string, description: string) {
    setNotice({ title, description });
    setNoticeVersion(version => version + 1);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(event.currentTarget);
    setSubmitted(true);
    setErrors(nextErrors);
    setNotice(null);
    const firstInvalid = Object.keys(nextErrors)[0];
    if (firstInvalid) {
      requestAnimationFrame(() => {
        const field = formRef.current?.elements.namedItem(firstInvalid);
        if (field instanceof HTMLElement) field.focus();
      });
      return;
    }
    showNotice("Accounts are not live yet.", "Your details validated successfully. Backend account creation will be connected in a later phase, so no account was created.");
  }

  return <main className="min-h-dvh bg-background lg:grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
    <aside aria-label="About Dovia" className="relative hidden flex-col justify-between overflow-hidden bg-sidebar p-10 text-sidebar-text lg:flex xl:p-16">
      <Brand compact href="/" label="Dovia home" sizes="48px" className="w-fit text-sidebar-text hover:text-on-brand focus-visible:outline-sidebar-text [&>img]:size-12 [&>span]:text-2xl" />
      <div className="my-16 max-w-md space-y-8">
        <p className="text-xs font-medium tracking-widest text-sidebar-muted uppercase">From discussion to done</p>
        <h2 className="text-4xl leading-tight font-semibold tracking-tight xl:text-5xl">Good conversations.<br /><span className="text-sidebar-muted">Clear next steps.</span></h2>
        <p className="text-base leading-relaxed text-sidebar-text">A shared space to turn meeting notes into decisions, ownership, and meaningful progress.</p>
        <div className="space-y-5 border-t border-sidebar-hover pt-8">
          {[
            { icon: MessageSquareText, title: "Capture what matters", text: "Keep the context behind every decision." },
            { icon: ListChecks, title: "Make the next step clear", text: "Turn action items into work you can track." },
            { icon: Users, title: "Move forward together", text: "Give every follow-up an owner and a deadline." },
          ].map(({ icon: Icon, title, text }) => <div key={title} className="flex items-start gap-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-sidebar-secondary"><Icon aria-hidden="true" className="size-5 text-sidebar-text" /></span>
            <div><p className="text-sm font-medium">{title}</p><p className="mt-1 text-sm leading-relaxed text-sidebar-muted">{text}</p></div>
          </div>)}
        </div>
      </div>
      <p className="text-sm text-sidebar-muted">Turn conversations into action.</p>
    </aside>

    <div className="flex min-w-0 items-center justify-center px-4 py-8 sm:px-8 sm:py-12 lg:px-10">
      <div className="w-full max-w-lg space-y-6">
        <Brand compact href="/" label="Dovia home" sizes="44px" className="mx-auto w-fit gap-1 text-foreground hover:text-primary lg:hidden [&>img]:size-11" />
        <Card shadow="sm">
          <CardHeader className="space-y-3 pb-6 sm:px-8 sm:pt-8">
            <Badge variant="ai" className="w-fit"><Check aria-hidden="true" />A clearer way to work</Badge>
            <h1 className="dovia-section-title">Create your Dovia account</h1>
            <p className="text-sm leading-relaxed text-text-secondary">Bring your team’s conversations and next steps together.</p>
          </CardHeader>
          <CardContent className="space-y-6 sm:px-8 sm:pb-8">
            <div className="grid gap-3 sm:grid-cols-2">
              <Button variant="outline" onClick={() => showNotice("Google sign-up is a preview.", "Google account connection will be available when authentication is connected.")}><span aria-hidden="true" className="flex size-4 shrink-0 items-center justify-center text-[0.9rem] leading-none font-bold">G</span>Sign up with Google</Button>
              <Button variant="outline" onClick={() => showNotice("Microsoft sign-up is a preview.", "Microsoft account connection will be available when authentication is connected.")}><span aria-hidden="true" className="grid size-4 shrink-0 grid-cols-2 gap-0.5"><span className="bg-current" /><span className="bg-current" /><span className="bg-current" /><span className="bg-current" /></span>Sign up with Microsoft</Button>
            </div>
            <div className="flex items-center gap-3 text-xs text-text-muted"><span aria-hidden="true" className="h-px flex-1 bg-border" />or sign up with email<span aria-hidden="true" className="h-px flex-1 bg-border" /></div>
            <form ref={formRef} noValidate onSubmit={handleSubmit} className="space-y-4"
              onChange={event => { if (submitted) setErrors(validate(event.currentTarget)); setNotice(null); }}>
              {Object.keys(errors).length > 0 && <p role="alert" className="rounded-default bg-danger-soft px-3 py-2 text-sm text-danger-foreground">Please check the highlighted fields below.</p>}
              <Input id="fullName" name="fullName" label="Full name" autoComplete="name" placeholder="Your full name" required error={errors.fullName} />
              <Input id="email" name="email" label="Work email" type="email" autoComplete="email" autoCapitalize="none" spellCheck={false} placeholder="you@company.com" required error={errors.email} />
              <PasswordField name="password" label="Password" helperText="Use at least 8 characters." error={errors.password} />
              <PasswordField name="confirmPassword" label="Confirm password" error={errors.confirmPassword} />
              <Input id="company" name="company" label="Workspace/Company name (optional)" autoComplete="organization" placeholder="Your team or company" />
              <Checkbox id="terms" name="terms" label="I agree to the terms" required error={errors.terms} />
              <Button type="submit" className="w-full">Create account<ArrowRight aria-hidden="true" /></Button>
            </form>
            <p className="text-center text-sm text-text-secondary">Already have an account? <Link href="/login" className="rounded-sm font-medium">Sign in</Link></p>
          </CardContent>
        </Card>
        <p className="text-center text-xs text-text-muted lg:hidden">Turn conversations into action.</p>
      </div>
    </div>
    {notice && <div className="fixed right-4 bottom-4 left-4 z-[var(--z-toast)] sm:left-auto">
      <Toast key={noticeVersion} variant="info" title={notice.title} description={notice.description} onDismiss={() => setNotice(null)} />
    </div>}
  </main>;
}
