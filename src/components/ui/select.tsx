import type { ReactNode } from "react";

// TODO: Implement select UI and behavior. This is a structural placeholder only.
export default function Select({ children }: { children?: ReactNode }) {
  return <div data-placeholder="select">{children ?? "Select placeholder"}</div>;
}
