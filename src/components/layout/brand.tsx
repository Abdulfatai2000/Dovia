import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Brand({ className, compact = false, onNavigate }: { className?: string; compact?: boolean; onNavigate?: () => void }) {
  return <Link href="/dashboard" onNavigate={onNavigate} aria-label="Dovia dashboard"
    className={cn("inline-flex min-h-11 shrink-0 items-center gap-2 rounded-default font-semibold tracking-tight text-inherit hover:text-inherit hover:no-underline", className)}>
    <Image src="/logo/dovia-mark.png" alt="" width={40} height={40} sizes="40px" className="size-10 shrink-0 object-contain" />
    <span className={cn("text-xl", !compact && "sidebar-label")}>Dovia</span>
  </Link>;
}
