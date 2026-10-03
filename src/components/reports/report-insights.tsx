import { CircleAlert, CircleCheck, Lightbulb, ListTodo } from "lucide-react";
import { Card } from "@/components/ui/card";

const icons = [CircleAlert, ListTodo, CircleCheck, Lightbulb];
const tones = [
  "bg-danger-soft text-danger-foreground",
  "bg-info-soft text-info-foreground",
  "bg-success-soft text-success-foreground",
  "bg-ai-soft text-ai",
];

/** Every sentence here is derived in report.service; this component only renders them. */
export function ReportInsights({ insights }: { insights: string[] }) {
  return <section className="flex h-full min-w-0 flex-col">
    <Card className="flex h-full flex-col p-[var(--card-padding)]">
      <h2 className="dovia-card-title">Recent Insights</h2>
      <p className="mt-1 mb-4 text-sm text-text-secondary">Derived from the meetings and tasks in the selected period.</p>
      <ul role="list" className="min-w-0 space-y-3">
        {insights.map((insight, index) => {
          const Icon = icons[index % icons.length];
          return <li key={insight} className="flex items-start gap-3">
            <span aria-hidden="true" className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-pill ${tones[index % tones.length]}`}>
              <Icon className="size-3.5" />
            </span>
            <span className="min-w-0 text-sm leading-relaxed text-text-secondary">{insight}</span>
          </li>;
        })}
      </ul>
    </Card>
  </section>;
}
export default ReportInsights;