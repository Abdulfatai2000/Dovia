import type { ReactNode } from "react";

// TODO: Implement task-preview UI and behavior. This is a structural placeholder only.
export default function TaskPreview({ children }: { children?: ReactNode }) {
  return <div data-placeholder="task-preview">{children ?? "TaskPreview placeholder"}</div>;
}
