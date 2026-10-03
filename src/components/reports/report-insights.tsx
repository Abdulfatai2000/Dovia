import { Lightbulb } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";

/** Every sentence here is derived in report.service; this component only renders them. */
export function ReportInsights({ insights }: { insights: string[] }) {
  return <section className="min-w-0 space-y-4">
    <SectionHeader title="Recent Insights" description="Derived from the meetings and tasks in the selected period." />
    <Card className="p-[var(--card-padding)]">
      <ul role="list" className="space-y-3">
        {insights.map(insight => <li key={insight} className="flex items-start gap-3 text-sm leading-relaxed text-text-secondary">
          <Lightbulb aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-ai" />
          <span>{insight}</span>
        </li>)}
      </ul>
    </Card>
  </section>;
}
export default ReportInsights;