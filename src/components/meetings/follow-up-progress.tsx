import type { ReactNode } from "react";

// TODO: Implement follow-up-progress UI and behavior. This is a structural placeholder only.
export default function FollowUpProgress({ children }: { children?: ReactNode }) {
  return <div data-placeholder="follow-up-progress">{children ?? "FollowUpProgress placeholder"}</div>;
}
