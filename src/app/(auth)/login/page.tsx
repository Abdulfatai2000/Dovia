"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { ArrowRight } from "lucide-react";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthNotice, type AuthNoticeValue } from "@/components/auth/auth-notice";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthSocialButtons } from "@/components/auth/social-auth-buttons";
import { PasswordInput } from "@/components/auth/password-input";
import { firstInvalidField, validateLoginForm, type FieldErrors } from "@/components/auth/auth-validation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [notice, setNotice] = useState<AuthNoticeValue | null>(null);
  const [saving, setSaving] = useState(false);

  function focusField(name: string) {
    requestAnimationFrame(() => {
      const field = formRef.current?.elements.namedItem(name);
      if (field instanceof HTMLElement) field.focus();
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    const nextErrors = validateLoginForm(event.currentTarget);
    setSubmitted(true);
    setErrors(nextErrors);
    setNotice(null);
    const firstInvalid = firstInvalidField(nextErrors);
    if (firstInvalid) {
      focusField(firstInvalid);
      return;
    }
    const form = event.currentTarget;
    const email = String(new FormData(form).get("email") ?? "");
    const password = String(new FormData(form).get("password") ?? "");
    try {
      setSaving(true);
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error === "EMAIL_NOT_VERIFIED") {
        setNotice({
          title: "Your email hasn't been verified yet.",
          description: "Verify your email before signing in.",
        });
        return;
      }
      if (result?.error) {
        setNotice({ title: "Invalid email or password.", description: "Please check your details and try again." });
        return;
      }
      router.push("/dashboard");
    } catch {
      setNotice({ title: "Sign in failed.", description: "Please try again." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <AuthShell>
      <AuthCard title="Welcome back" description="Sign in to your Dovia account.">
        <form ref={formRef} noValidate onSubmit={handleSubmit} className="space-y-4"
          onChange={event => {
            if (submitted) setErrors(validateLoginForm(event.currentTarget));
            setNotice(null);
          }}>
          {Object.keys(errors).length > 0 && (
            <p role="alert" className="rounded-default bg-danger-soft px-3 py-2 text-sm text-danger-foreground">
              Please check the highlighted fields below.
            </p>
          )}
          <Input id="email" name="email" label="Email address" type="email" autoComplete="email"
            autoCapitalize="none" spellCheck={false} placeholder="you@company.com" required error={errors.email} />
          <PasswordInput id="password" name="password" label="Password" autoComplete="current-password"
            placeholder="Enter your password" error={errors.password} />

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <Checkbox id="remember" name="remember" label="Remember me" />
            <Link href="/forgot-password" className="rounded-sm text-sm font-medium">Forgot password?</Link>
          </div>

          <Button type="submit" variant="gradient" className="w-full" loading={saving}>Sign in<ArrowRight aria-hidden="true" /></Button>
        </form>

        <AuthSocialButtons
          onGoogle={() => setNotice({
            title: "Google sign-in will be connected during backend development.",
            description: "This button is a preview and does not sign you in.",
          })}
          onMicrosoft={() => setNotice({
            title: "Microsoft sign-in will be connected during backend development.",
            description: "This button is a preview and does not sign you in.",
          })} />

        <p className="text-center text-sm text-text-secondary">
          Don&apos;t have an account? <Link href="/signup" className="rounded-sm font-medium">Sign up</Link>
        </p>

        <div className="flex items-center justify-center gap-2">
          <Badge variant="neutral">Demo</Badge>
          <Link href="/dashboard" className="inline-flex items-center gap-1 rounded-sm text-sm font-medium">
            View demo workspace<ArrowRight aria-hidden="true" className="size-3.5" />
          </Link>
        </div>
      </AuthCard>
      <AuthNotice notice={notice} onDismiss={() => setNotice(null)} />
    </AuthShell>
  );
}
