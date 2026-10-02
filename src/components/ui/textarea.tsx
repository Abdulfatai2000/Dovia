import type { ReactNode } from "react";

// TODO: Implement textarea UI and behavior. This is a structural placeholder only.
export default function Textarea({ children }: { children?: ReactNode }) {
  return <div data-placeholder="textarea">{children ?? "Textarea placeholder"}</div>;
}
