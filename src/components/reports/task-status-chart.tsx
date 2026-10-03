export interface StatusBucket { key: string; status: string; count: number; }
export interface TaskStatusChartProps { buckets: StatusBucket[]; total: number; }

/** Distinct fill per bucket, always paired with a text label, count, and percentage. */
const fills: Record<string, string> = {
  COMPLETED: "var(--color-success-foreground)",
  IN_PROGRESS: "var(--color-primary)",
  NOT_STARTED: "var(--color-text-muted)",
  BLOCKED: "var(--color-danger-foreground)",
  OVERDUE: "var(--color-warning-foreground)",
};

/** Dependency-free donut. The data table below it is the accessible source of truth. */
export function TaskStatusChart({ buckets, total }: TaskStatusChartProps) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  const percent = (count: number) => (total > 0 ? Math.round((count / total) * 100) : 0);

  return <div className="grid items-center gap-6 sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)]">
    <div className="relative mx-auto size-40 shrink-0">
      <svg viewBox="0 0 140 140" className="size-full -rotate-90" role="img"
        aria-label={`Task status distribution: ${buckets.map(bucket => `${bucket.key} ${bucket.count}, ${percent(bucket.count)} percent`).join("; ")}.`}>
        <circle cx="70" cy="70" r={radius} fill="none" stroke="var(--color-border)" strokeWidth="16" />
        {buckets.filter(bucket => bucket.count > 0).map(bucket => {
          const length = (bucket.count / (total || 1)) * circumference;
          const segment = <circle key={bucket.status} cx="70" cy="70" r={radius} fill="none"
            stroke={fills[bucket.status] ?? "var(--color-primary)"} strokeWidth="16" strokeDasharray={`${length} ${circumference - length}`}
            strokeDashoffset={-offset} />;
          offset += length;
          return segment;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-semibold text-foreground">{total}</span>
        <span className="text-xs text-text-muted">tasks</span>
      </div>
    </div>
    <table className="w-full min-w-0 text-sm">
      <caption className="sr-only">Task counts and percentages by status</caption>
      <thead><tr className="text-left text-xs text-text-muted">
        <th scope="col" className="py-1 font-medium">Status</th>
        <th scope="col" className="py-1 text-right font-medium">Tasks</th>
        <th scope="col" className="py-1 text-right font-medium">Share</th>
      </tr></thead>
      <tbody className="divide-y divide-border">
        {buckets.map(bucket => <tr key={bucket.status}>
          <th scope="row" className="py-2 pr-3 text-left font-normal text-foreground">
            <span className="flex items-center gap-2">
              <span aria-hidden="true" className="size-2.5 shrink-0 rounded-pill" style={{ background: fills[bucket.status] ?? "var(--color-primary)" }} />
              {bucket.key}
            </span>
          </th>
          <td className="py-2 text-right tabular-nums text-text-secondary">{bucket.count}</td>
          <td className="py-2 text-right tabular-nums text-text-secondary">{percent(bucket.count)}%</td>
        </tr>)}
      </tbody>
    </table>
  </div>;
}
export default TaskStatusChart;