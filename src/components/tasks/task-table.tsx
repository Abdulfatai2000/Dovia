import type { ReactNode } from "react";

// TODO: Implement task-table UI and behavior. This is a structural placeholder only.
export default function TaskTable({ children }: { children?: ReactNode }) {
  return <div data-placeholder="task-table">{children ?? "TaskTable placeholder"}</div>;
}
