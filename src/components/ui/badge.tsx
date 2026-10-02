import type { ReactNode } from "react";

// TODO: Implement badge UI and behavior. This is a structural placeholder only.
export default function Badge({ children }: { children?: ReactNode }) {
  return <div data-placeholder="badge">{children ?? "Badge placeholder"}</div>;
}
