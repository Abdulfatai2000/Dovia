import type { ReactNode } from "react";

// TODO: Implement card UI and behavior. This is a structural placeholder only.
export default function Card({ children }: { children?: ReactNode }) {
  return <div data-placeholder="card">{children ?? "Card placeholder"}</div>;
}
