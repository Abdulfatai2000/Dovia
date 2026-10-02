import type { ReactNode } from "react";

// TODO: Implement tabs UI and behavior. This is a structural placeholder only.
export default function Tabs({ children }: { children?: ReactNode }) {
  return <div data-placeholder="tabs">{children ?? "Tabs placeholder"}</div>;
}
