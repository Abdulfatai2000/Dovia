import type { ReactNode } from "react";

// TODO: Implement workspace-shell UI and behavior. This is a structural placeholder only.
export default function WorkspaceShell({ children }: { children?: ReactNode }) {
  return <div data-placeholder="workspace-shell">{children ?? "WorkspaceShell placeholder"}</div>;
}
