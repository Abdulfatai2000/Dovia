import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type StatTone = "blue" | "violet" | "orange" | "emerald";
const tones: Record<StatTone, { chip: string; wash: string }> = {
  blue: { chip: "bg-blue-soft text-blue-foreground", wash: "from-blue/12 to-transparent" },
  violet: { chip: "bg-violet-soft text-violet-foreground", wash: "from-violet/12 to-transparent" },
  orange: { chip: "bg-orange-soft text-orange-foreground", wash: "from-orange/14 to-transparent" },
  emerald: { chip: "bg-emerald-soft text-emerald-foreground", wash: "from-emerald/12 to-transparent" },
};

export default function StatCard({ label, value, description, icon, tone = "blue" }: { label: string; value: number; description: string; icon: ReactNode; tone?: StatTone }) {
  const palette = tones[tone];
  return <Card className={cn("dovia-lift relative overflow-hidden border-border/80", `bg-gradient-to-br ${palette.wash}`)}>
    <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-40" />
    <div className="relative flex items-start justify-between gap-3">
      <p className="text-sm font-medium text-text-secondary">{label}</p>
      <span aria-hidden="true" className={cn("flex size-9 shrink-0 items-center justify-center rounded-default [&_svg]:size-5", palette.chip)}>{icon}</span>
    </div>
    <p className="dovia-pop relative mt-3 text-3xl font-semibold tracking-tight">{value}</p>
    <p className="relative mt-2 text-xs text-text-muted">{description}</p>
  </Card>;
}