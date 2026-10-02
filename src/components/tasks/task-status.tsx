import type { ReactNode } from "react";

// TODO: Implement task-status UI and behavior. This is a structural placeholder only.
export default function TaskStatus({ children }: { children?: ReactNode }) {
  return <div data-placeholder="task-status">{children ?? "TaskStatus placeholder"}</div>;
}
