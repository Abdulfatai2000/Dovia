import type { ReactNode } from "react";

// TODO: Implement calendar-event UI and behavior. This is a structural placeholder only.
export default function CalendarEvent({ children }: { children?: ReactNode }) {
  return <div data-placeholder="calendar-event">{children ?? "CalendarEvent placeholder"}</div>;
}
