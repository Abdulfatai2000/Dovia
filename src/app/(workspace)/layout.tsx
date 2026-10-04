import type { ReactNode } from "react";
import { WorkspaceShell } from "@/components/layout/workspace-shell";
import { RouteAccent } from "@/components/theme/route-accent";

export default function Layout({ children }: { children: ReactNode }) {
  return <WorkspaceShell><RouteAccent />{children}</WorkspaceShell>;
}