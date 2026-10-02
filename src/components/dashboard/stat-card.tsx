import type { ReactNode } from "react";

// TODO: Implement stat-card UI and behavior. This is a structural placeholder only.
export default function StatCard({ children }: { children?: ReactNode }) {
  return <div data-placeholder="stat-card">{children ?? "StatCard placeholder"}</div>;
}
