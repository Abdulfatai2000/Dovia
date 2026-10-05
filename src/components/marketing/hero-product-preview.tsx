import { Sparkles, Check, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/status-badge";
import { previewTasks } from "@/data/marketing";
export default function HeroProductPreview() {
  return <div className="relative">
    <span aria-hidden="true" className="dovia-orb dovia-gradient pointer-events-none absolute -top-10 -right-8 size-72 rounded-pill opacity-30 blur-3xl" />
    <span aria-hidden="true" className="dovia-orb dovia-gradient-ai pointer-events-none absolute -bottom-12 -left-8 size-64 rounded-pill opacity-25 blur-3xl [animation-delay:-9s]" />
  <Card shadow="lg" className="dovia-glass relative overflow-hidden rounded-xl border-border-strong text-left">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface-soft/70 px-5 py-4"><span className="flex items-center gap-2 text-sm font-medium"><span aria-hidden="true" className="size-2 rounded-pill bg-emerald shadow-[0_0_8px_rgb(16_185_129/70%)]" />Meeting workspace</span><Badge variant="neutral">Illustrative preview</Badge></div>
    <div className="space-y-5 p-5 sm:p-7"><div className="space-y-3"><h2 className="dovia-card-title">Product Strategy Sync</h2><Badge variant="ai"><Sparkles aria-hidden="true" />AI Meeting Summary</Badge><p className="text-sm leading-relaxed text-text-secondary">The team aligned on launch priorities and outlined the work needed to move forward.</p></div>
      <div className="rounded-md bg-emerald-soft p-4 ring-1 ring-emerald/20 ring-inset"><h3 className="text-sm font-semibold text-emerald-foreground">Key Decisions</h3><p className="mt-2 flex gap-2 text-sm text-text-secondary"><Check aria-hidden="true" className="size-4 shrink-0 text-emerald-foreground" />Keep the launch focused on the core workflow.</p></div>
      <div className="space-y-3"><h3 className="text-sm font-semibold">Action Items</h3>{previewTasks.map(task => <div key={task.title} className="flex flex-wrap items-start justify-between gap-3 rounded-md border border-border bg-surface-elevated p-3 transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-sm"><div className="min-w-0"><p className="text-sm font-medium">{task.title}</p><div className="mt-2 flex items-center gap-2"><Avatar name={task.owner} size="xs" /><span className="text-xs text-text-muted">{task.owner}</span></div></div><StatusBadge status={task.status} /></div>)}</div>
      <div className="flex items-start gap-2 border-t border-border pt-4 text-sm text-primary"><ArrowRight aria-hidden="true" className="mt-0.5 size-4 shrink-0" /><p><span className="font-medium">Next Steps</span><br /><span className="text-text-secondary">Review owners and deadlines before confirming.</span></p></div>
    </div>
  </Card></div>;
}
