"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthNotice, type AuthNoticeValue } from "@/components/auth/auth-notice";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthSocialButtons } from "@/components/auth/social-auth-buttons";
import { PasswordInput } from "@/components/auth/password-input";
import { firstInvalidField, validateSignupForm, type FieldErrors } from "@/components/auth/auth-validation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [notice, setNotice] = useState<AuthNoticeValue | null>(null);

  function focusField(name: string) {
    requestAnimationFrame(() => {
      const field = formRef.current?.elements.namedItem(name);
      if (field instanceof HTMLElement) field.focus();
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    const nextErrors = validateSignupForm(event.currentTarget);
    setSubmitted(true);
    setErrors(nextErrors);
    setNotice(null);
    const firstInvalid = firstInvalidField(nextErrors);
    if (firstInvalid) {
      focusField(firstInvalid);
      return;
    }

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("fullName") ?? ""),
      email: String(data.get("email") ?? ""),
      password: String(data.get("password") ?? ""),
      workspaceName: String(data.get("company") ?? ""),
    };

    try {
      setSaving(true);
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        setNotice({ title: "Unable to create your account.", description: result.error?.message || "Please try again." });
        return;
      }
      router.push("/verify-email");
    } catch {
      setNotice({ title: "Unable to create your account.", description: "Please try again." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <AuthShell>
      <AuthCard title="Create your Dovia account"
        description="Start turning meetings into clear decisions and action.">
        <form ref={formRef} noValidate onSubmit={handleSubmit} className="space-y-4"
          onChange={event => {
            if (submitted) setErrors(validateSignupForm(event.currentTarget));
            setNotice(null);
          }}>
          {Object.keys(errors).length > 0 && (
            <p role="alert" className="rounded-default bg-danger-soft px-3 py-2 text-sm text-danger-foreground">
              Please check the highlighted fields below.
            </p>
          )}
          <Input id="fullName" name="fullName" label="Full name" autoComplete="name"
            placeholder="Your full name" required error={errors.fullName} />
          <Input id="email" name="email" label="Work email" type="email" autoComplete="email"
            autoCapitalize="none" spellCheck={false} placeholder="you@company.com" required error={errors.email} />
          <Input id="company" name="company" label="Workspace / company name (optional)" autoComplete="organization"
            placeholder="Your team or company" />
          <PasswordInput id="password" name="password" label="Password" autoComplete="new-password"
            placeholder="Create a password" showRequirements error={errors.password} />
          <PasswordInput id="confirmPassword" name="confirmPassword" label="Confirm password"
            autoComplete="new-password" placeholder="Re-enter your password" error={errors.confirmPassword} />
          <Checkbox id="terms" name="terms" label="I agree to the terms" required error={errors.terms} />

          <Button type="submit" variant="gradient" className="w-full" loading={saving}>Create account<ArrowRight aria-hidden="true" /></Button>
        </form>

        <AuthSocialButtons
          onGoogle={() => setNotice({
            title: "Google sign-up will be connected during backend development.",
            description: "This button is a preview and does not create an account.",
          })}
          onMicrosoft={() => setNotice({
            title: "Microsoft sign-up will be connected during backend development.",
            description: "This button is a preview and does not create an account.",
          })} />

        <p className="text-center text-sm text-text-secondary">
          Already have an account? <Link href="/login" className="rounded-sm font-medium">Sign in</Link>
        </p>
      </AuthCard>
      <AuthNotice notice={notice} onDismiss={() => setNotice(null)} />
    </AuthShell>
  );
}
