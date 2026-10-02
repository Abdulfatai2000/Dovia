import type { ReactNode } from "react";

// TODO: Implement topbar UI and behavior. This is a structural placeholder only.
export default function Topbar({ children }: { children?: ReactNode }) {
  return <div data-placeholder="topbar">{children ?? "Topbar placeholder"}</div>;
}
