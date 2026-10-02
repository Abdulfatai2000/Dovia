import type { ReactNode } from "react";

// TODO: Implement skeleton UI and behavior. This is a structural placeholder only.
export default function Skeleton({ children }: { children?: ReactNode }) {
  return <div data-placeholder="skeleton">{children ?? "Skeleton placeholder"}</div>;
}
