import type { ReactNode } from "react";

// TODO: Implement meeting-participants UI and behavior. This is a structural placeholder only.
export default function MeetingParticipants({ children }: { children?: ReactNode }) {
  return <div data-placeholder="meeting-participants">{children ?? "MeetingParticipants placeholder"}</div>;
}
