import type { ReactNode } from "react";
import SettingsNav from "./settings-nav";

/** Shared settings frame so every settings route uses one navigation structure. */
export function SettingsShell({ children }: { children: ReactNode }) {
  return <div className="min-w-0 space-y-6">
    <SettingsNav />
    <div className="min-w-0">{children}</div>
  </div>;
}
export default SettingsShell;