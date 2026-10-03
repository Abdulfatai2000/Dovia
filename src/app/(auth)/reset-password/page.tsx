import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { PasswordRecoveryForm } from "@/components/auth/password-recovery-form";

export const metadata: Metadata = { title: "Reset password | Dovia" };

export default function ResetPasswordPage() {
  return <AuthShell><PasswordRecoveryForm mode="reset" /></AuthShell>;
}
