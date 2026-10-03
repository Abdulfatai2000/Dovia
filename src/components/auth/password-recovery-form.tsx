"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { AuthCard } from "./auth-card";
import { AuthNotice, type AuthNoticeValue } from "./auth-notice";
import { PasswordInput } from "./password-input";
import { firstInvalidField, isValidEmail, MIN_PASSWORD_LENGTH, type FieldErrors } from "./auth-validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function PasswordRecoveryForm({ mode }: { mode: "forgot" | "reset" }) {
  const isForgot = mode === "forgot";
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [notice, setNotice] = useState<AuthNoticeValue | null>(null);

  function validate(form: HTMLFormElement): FieldErrors {
    const data = new FormData(form);
    const nextErrors: FieldErrors = {};
    if (isForgot) {
      const email = String(data.get("email") ?? "").trim();
      if (!email) nextErrors.email = "Enter your email address.";
      else if (!isValidEmail(email)) nextErrors.email = "Enter a valid email address.";
    } else {
      const password = String(data.get("password") ?? "");
      const confirmation = String(data.get("confirmPassword") ?? "");
      if (!password) nextErrors.password = "Enter your new password.";
      else if (password.length < MIN_PASSWORD_LENGTH) {
        nextErrors.password = `Use at least ${MIN_PASSWORD_LENGTH} characters for your password.`;
      }
      if (!confirmation) nextErrors.confirmPassword = "Confirm your new password.";
      else if (confirmation !== password) nextErrors.confirmPassword = "Your passwords do not match.";
    }
    return nextErrors;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(event.currentTarget);
    setSubmitted(true);
    setErrors(nextErrors);
    setNotice(null);
    const firstInvalid = firstInvalidField(nextErrors);
    if (firstInvalid) {
      requestAnimationFrame(() => {
        const field = formRef.current?.elements.namedItem(firstInvalid);
        if (field instanceof HTMLElement) field.focus();
      });
      return;
    }
    setNotice(isForgot ? {
      title: "Password reset email delivery will be connected during backend development.",
      description: "Your email address validated successfully. No email was sent.",
    } : {
      title: "Password reset will be connected during backend development.",
      description: "Your details validated successfully. No credentials were changed.",
    });
  }

  return (
    <>
      <AuthCard
        title={isForgot ? "Forgot your password?" : "Create a new password"}
        description={isForgot
          ? "Enter the email associated with your Dovia account and we'll help you reset your password."
          : "Choose a secure new password for your Dovia account."}>
        <form ref={formRef} noValidate onSubmit={handleSubmit} className="space-y-4"
          onChange={event => {
            if (submitted) setErrors(validate(event.currentTarget));
            setNotice(null);
          }}>
          {Object.keys(errors).length > 0 && (
            <p role="alert" className="rounded-default bg-danger-soft px-3 py-2 text-sm text-danger-foreground">
              Please check the highlighted fields below.
            </p>
          )}
          {isForgot ? (
            <Input id="email" name="email" label="Email address" type="email" autoComplete="email"
              autoCapitalize="none" spellCheck={false} placeholder="you@company.com" required error={errors.email} />
          ) : (
            <>
              <PasswordInput id="password" name="password" label="New password" autoComplete="new-password"
                placeholder="Enter a new password" helperText={`Use at least ${MIN_PASSWORD_LENGTH} characters.`}
                error={errors.password} />
              <PasswordInput id="confirmPassword" name="confirmPassword" label="Confirm new password"
                autoComplete="new-password" placeholder="Re-enter your new password" error={errors.confirmPassword} />
            </>
          )}
          <Button type="submit" variant="gradient" className="w-full">
            {isForgot ? "Send reset instructions" : "Reset password"}<ArrowRight aria-hidden="true" />
          </Button>
        </form>
        <p className="text-center text-sm text-text-secondary">
          {isForgot && <>Remember your password? </>}
          <Link href="/login" className="rounded-sm font-medium">Back to sign in</Link>
        </p>
      </AuthCard>
      <AuthNotice notice={notice} onDismiss={() => setNotice(null)} />
    </>
  );
}
