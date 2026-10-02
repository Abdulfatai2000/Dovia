import type { ReactNode } from "react";

// TODO: Implement calendar-view UI and behavior. This is a structural placeholder only.
export default function CalendarView({ children }: { children?: ReactNode }) {
  return <div data-placeholder="calendar-view">{children ?? "CalendarView placeholder"}</div>;
}
