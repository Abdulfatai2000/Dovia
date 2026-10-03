import { Sparkles, Check, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/status-badge";
import { previewTasks } from "@/data/marketing";
export default function HeroProductPreview() {
  return <Card shadow="default" className="overflow-hidden text-left"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface-soft px-5 py-4"><span className="text-sm font-medium">Meeting workspace</span><Badge variant="neutral">Illustrative preview</Badge></div>
    <div className="space-y-5 p-5 sm:p-7"><div className="space-y-3"><h2 className="dovia-card-title">Product Strategy Sync</h2><Badge variant="ai"><Sparkles aria-hidden="true" />AI Meeting Summary</Badge><p className="text-sm leading-relaxed text-text-secondary">The team aligned on launch priorities and outlined the work needed to move forward.</p></div>
      <div className="rounded-md bg-success-soft p-4"><h3 className="text-sm font-semibold text-success-foreground">Key Decisions</h3><p className="mt-2 flex gap-2 text-sm text-text-secondary"><Check aria-hidden="true" className="size-4 shrink-0 text-success-foreground" />Keep the launch focused on the core workflow.</p></div>
      <div className="space-y-3"><h3 className="text-sm font-semibold">Action Items</h3>{previewTasks.map(task => <div key={task.title} className="flex flex-wrap items-start justify-between gap-3 rounded-md border border-border p-3"><div className="min-w-0"><p className="text-sm font-medium">{task.title}</p><div className="mt-2 flex items-center gap-2"><Avatar name={task.owner} size="xs" /><span className="text-xs text-text-muted">{task.owner}</span></div></div><StatusBadge status={task.status} /></div>)}</div>
      <div className="flex items-start gap-2 border-t border-border pt-4 text-sm text-primary"><ArrowRight aria-hidden="true" className="mt-0.5 size-4 shrink-0" /><p><span className="font-medium">Next Steps</span><br /><span className="text-text-secondary">Review owners and deadlines before confirming.</span></p></div>
    </div>
  </Card>;
}
