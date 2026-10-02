import type { ReactNode } from "react";

// TODO: Implement avatar UI and behavior. This is a structural placeholder only.
export default function Avatar({ children }: { children?: ReactNode }) {
  return <div data-placeholder="avatar">{children ?? "Avatar placeholder"}</div>;
}
