import Link from "next/link";
import { Brand } from "@/components/layout/brand";
export default function MarketingFooter() {
  return <footer className="relative overflow-hidden border-t border-border bg-surface-soft/60"><span aria-hidden="true" className="dovia-orb dovia-gradient pointer-events-none absolute -bottom-24 left-1/4 size-80 rounded-pill opacity-20 blur-3xl" /><div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 md:flex-row md:justify-between lg:px-8"><div className="space-y-3"><Brand compact href="/" label="Dovia home" /><p className="text-sm text-text-secondary">Turn conversations into action.</p><p className="max-w-sm text-xs leading-relaxed text-text-muted">Dovia is a frontend preview. AI, integrations, account creation, and subscriptions are not connected yet.</p></div>
    <nav aria-label="Footer navigation" className="flex flex-wrap content-start gap-x-6 gap-y-4 text-sm"><Link href="/features">Features</Link><Link href="/pricing">Pricing</Link><Link href="/about">About</Link><Link href="/login">Sign in</Link><Link href="/signup">Create account</Link></nav>
  </div></footer>;
}
