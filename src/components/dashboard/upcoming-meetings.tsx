import type { ReactNode } from "react";

// TODO: Implement upcoming-meetings UI and behavior. This is a structural placeholder only.
export default function UpcomingMeetings({ children }: { children?: ReactNode }) {
  return <div data-placeholder="upcoming-meetings">{children ?? "UpcomingMeetings placeholder"}</div>;
}
