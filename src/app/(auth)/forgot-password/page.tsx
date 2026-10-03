import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { PasswordRecoveryForm } from "@/components/auth/password-recovery-form";

export const metadata: Metadata = { title: "Forgot password | Dovia" };

export default function ForgotPasswordPage() {
  return <AuthShell><PasswordRecoveryForm mode="forgot" /></AuthShell>;
}
