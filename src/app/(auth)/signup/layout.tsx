import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Create your Dovia account",
  description: "Create a Dovia account to turn your team’s conversations into decisions, ownership, and clear next steps.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
