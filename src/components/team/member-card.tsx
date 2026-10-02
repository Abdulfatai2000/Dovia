import type { ReactNode } from "react";

// TODO: Implement member-card UI and behavior. This is a structural placeholder only.
export default function MemberCard({ children }: { children?: ReactNode }) {
  return <div data-placeholder="member-card">{children ?? "MemberCard placeholder"}</div>;
}
