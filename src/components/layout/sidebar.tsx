import type { ReactNode } from "react";

// TODO: Implement sidebar UI and behavior. This is a structural placeholder only.
export default function Sidebar({ children }: { children?: ReactNode }) {
  return <div data-placeholder="sidebar">{children ?? "Sidebar placeholder"}</div>;
}
