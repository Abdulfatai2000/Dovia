import type { ReactNode } from "react";

// TODO: Implement progress UI and behavior. This is a structural placeholder only.
export default function Progress({ children }: { children?: ReactNode }) {
  return <div data-placeholder="progress">{children ?? "Progress placeholder"}</div>;
}
