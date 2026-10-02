import type { ReactNode } from "react";

// TODO: Implement table UI and behavior. This is a structural placeholder only.
export default function Table({ children }: { children?: ReactNode }) {
  return <div data-placeholder="table">{children ?? "Table placeholder"}</div>;
}
