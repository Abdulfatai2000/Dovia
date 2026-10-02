import type { ReactNode } from "react";

// TODO: Implement task-card UI and behavior. This is a structural placeholder only.
export default function TaskCard({ children }: { children?: ReactNode }) {
  return <div data-placeholder="task-card">{children ?? "TaskCard placeholder"}</div>;
}
