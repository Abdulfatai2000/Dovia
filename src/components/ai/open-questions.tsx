import type { ReactNode } from "react";

// TODO: Implement open-questions UI and behavior. This is a structural placeholder only.
export default function OpenQuestions({ children }: { children?: ReactNode }) {
  return <div data-placeholder="open-questions">{children ?? "OpenQuestions placeholder"}</div>;
}
