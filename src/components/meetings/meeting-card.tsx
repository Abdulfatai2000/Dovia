import type { ReactNode } from "react";

// TODO: Implement meeting-card UI and behavior. This is a structural placeholder only.
export default function MeetingCard({ children }: { children?: ReactNode }) {
  return <div data-placeholder="meeting-card">{children ?? "MeetingCard placeholder"}</div>;
}
