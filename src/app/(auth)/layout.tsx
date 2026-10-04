import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Sign in to Dovia",
  description: "Sign in to your Dovia account to see decisions, owners, and next steps from every meeting.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}