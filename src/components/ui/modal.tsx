import type { ReactNode } from "react";

// TODO: Implement modal UI and behavior. This is a structural placeholder only.
export default function Modal({ children }: { children?: ReactNode }) {
  return <div data-placeholder="modal">{children ?? "Modal placeholder"}</div>;
}
