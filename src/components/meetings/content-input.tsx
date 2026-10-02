import type { ReactNode } from "react";

// TODO: Implement content-input UI and behavior. This is a structural placeholder only.
export default function ContentInput({ children }: { children?: ReactNode }) {
  return <div data-placeholder="content-input">{children ?? "ContentInput placeholder"}</div>;
}
