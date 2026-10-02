import type { ReactNode } from "react";

// TODO: Implement security-settings UI and behavior. This is a structural placeholder only.
export default function SecuritySettings({ children }: { children?: ReactNode }) {
  return <div data-placeholder="security-settings">{children ?? "SecuritySettings placeholder"}</div>;
}
