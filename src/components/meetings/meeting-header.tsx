import type { ReactNode } from "react";

// TODO: Implement meeting-header UI and behavior. This is a structural placeholder only.
export default function MeetingHeader({ children }: { children?: ReactNode }) {
  return <div data-placeholder="meeting-header">{children ?? "MeetingHeader placeholder"}</div>;
}
