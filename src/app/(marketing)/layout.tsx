import type { ReactNode } from "react";
import MarketingHeader from "@/components/marketing/marketing-header";
import MarketingFooter from "@/components/marketing/marketing-footer";
export default function Layout({ children }: { children: ReactNode }) {
  return <div className="min-h-dvh bg-background"><a href="#marketing-main" className="fixed top-3 left-3 z-[var(--z-skip)] rounded-default bg-primary px-4 py-3 text-on-brand not-focus:sr-only">Skip to content</a><MarketingHeader /><main id="marketing-main" tabIndex={-1}>{children}</main><MarketingFooter /></div>;
}
