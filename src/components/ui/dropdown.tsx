import type { ReactNode } from "react";

// TODO: Implement dropdown UI and behavior. This is a structural placeholder only.
export default function Dropdown({ children }: { children?: ReactNode }) {
  return <div data-placeholder="dropdown">{children ?? "Dropdown placeholder"}</div>;
}
