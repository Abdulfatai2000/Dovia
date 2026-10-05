"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Brand } from "@/components/layout/brand";
import { ButtonLink } from "@/components/ui/button-link";
import { IconButton } from "@/components/ui/icon-button";
import { Modal } from "@/components/ui/modal";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { marketingLinks } from "@/data/marketing";
export default function MarketingHeader() {
  const [open,setOpen] = useState(false);
  const pathname = usePathname();
  const links = marketingLinks.map(link => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} aria-current={pathname === link.href ? "page" : undefined} className="rounded-default px-2 py-3 text-sm font-medium text-text-secondary hover:text-primary aria-[current=page]:text-primary">{link.label}</Link>);
return <><header className="dovia-glass sticky top-0 z-30 border-b border-border"><div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
    <Brand compact href="/" label="Dovia home" /><nav aria-label="Marketing navigation" className="hidden items-center gap-2 lg:flex">{links}</nav>
    <div className="hidden items-center gap-2 lg:flex"><ThemeToggle /><ButtonLink href="/login" variant="ghost">Sign in</ButtonLink><ButtonLink href="/signup" variant="gradient">Get started</ButtonLink></div>
    <IconButton className="lg:hidden" aria-label="Open navigation" aria-expanded={open} aria-controls="marketing-navigation" onClick={() => setOpen(true)}><Menu aria-hidden="true" /></IconButton>
  </div></header>
    <Modal id="marketing-navigation" open={open} onClose={() => setOpen(false)} title="Explore Dovia" size="sm"><nav aria-label="Mobile marketing navigation" className="flex flex-col gap-2">{links}<ThemeToggle variant="inline" className="w-full" /><ButtonLink href="/login" variant="outline" onClick={() => setOpen(false)}>Sign in</ButtonLink><ButtonLink href="/signup" variant="gradient" onClick={() => setOpen(false)}>Get started</ButtonLink></nav></Modal>
  </>;
}
