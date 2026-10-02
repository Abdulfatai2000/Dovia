import type { ReactNode } from "react";

// TODO: Implement decision-list UI and behavior. This is a structural placeholder only.
export default function DecisionList({ children }: { children?: ReactNode }) {
  return <div data-placeholder="decision-list">{children ?? "DecisionList placeholder"}</div>;
}
