import type { ReactNode } from "react";

// TODO: Implement mobile-nav UI and behavior. This is a structural placeholder only.
export default function MobileNav({ children }: { children?: ReactNode }) {
  return <div data-placeholder="mobile-nav">{children ?? "MobileNav placeholder"}</div>;
}
