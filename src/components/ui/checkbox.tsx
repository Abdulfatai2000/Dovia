import type { ReactNode } from "react";

// TODO: Implement checkbox UI and behavior. This is a structural placeholder only.
export default function Checkbox({ children }: { children?: ReactNode }) {
  return <div data-placeholder="checkbox">{children ?? "Checkbox placeholder"}</div>;
}
