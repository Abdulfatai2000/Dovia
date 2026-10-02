import type { ReactNode } from "react";

// TODO: Implement input UI and behavior. This is a structural placeholder only.
export default function Input({ children }: { children?: ReactNode }) {
  return <div data-placeholder="input">{children ?? "Input placeholder"}</div>;
}
