import type { ReactNode } from "react";

// TODO: Implement toast UI and behavior. This is a structural placeholder only.
export default function Toast({ children }: { children?: ReactNode }) {
  return <div data-placeholder="toast">{children ?? "Toast placeholder"}</div>;
}
