import type { ReactNode } from "react";

// TODO: Implement button UI and behavior. This is a structural placeholder only.
export default function Button({ children }: { children?: ReactNode }) {
  return <div data-placeholder="button">{children ?? "Button placeholder"}</div>;
}
