import type { ReactNode } from "react";

// TODO: Implement integration-card UI and behavior. This is a structural placeholder only.
export default function IntegrationCard({ children }: { children?: ReactNode }) {
  return <div data-placeholder="integration-card">{children ?? "IntegrationCard placeholder"}</div>;
}
