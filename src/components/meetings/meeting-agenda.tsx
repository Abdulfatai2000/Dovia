import type { ReactNode } from "react";

// TODO: Implement meeting-agenda UI and behavior. This is a structural placeholder only.
export default function MeetingAgenda({ children }: { children?: ReactNode }) {
  return <div data-placeholder="meeting-agenda">{children ?? "MeetingAgenda placeholder"}</div>;
}
