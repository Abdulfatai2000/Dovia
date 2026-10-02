import type { ReactNode } from "react";

// TODO: Implement task-filters UI and behavior. This is a structural placeholder only.
export default function TaskFilters({ children }: { children?: ReactNode }) {
  return <div data-placeholder="task-filters">{children ?? "TaskFilters placeholder"}</div>;
}
