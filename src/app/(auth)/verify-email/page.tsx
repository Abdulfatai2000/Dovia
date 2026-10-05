import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { EmailVerificationForm } from "@/components/auth/email-verification-form";

export const metadata: Metadata = { title: "Verify email | Dovia" };
export default function VerifyEmailPage() {
  return <AuthShell><EmailVerificationForm /></AuthShell>;
}
