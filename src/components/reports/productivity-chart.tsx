export interface ProductivityBucket { label: string; range: string; count: number; }
export interface ProductivityChartProps { buckets: ProductivityBucket[]; title?: string; }

/**
 * Dependency-free weekly bar chart. Rendered as a list so every bar is reachable by
 * screen readers, with the visual bar marked aria-hidden rather than color-coded only.
 */
export function ProductivityChart({ buckets, title = "Meetings held per week" }: ProductivityChartProps) {
  const max = Math.max(1, ...buckets.map(bucket => bucket.count));
  const summary = buckets.length
    ? `${buckets.reduce((total, bucket) => total + bucket.count, 0)} meetings held across ${buckets.length} weeks. Highest week: ${buckets.reduce((best, bucket) => bucket.count > best.count ? bucket : best).label}.`
    : "No meetings were held in this period.";
  return <figure className="min-w-0 space-y-4">
    <figcaption className="text-sm font-medium text-foreground">{title}</figcaption>
    <p className="text-sm text-text-secondary">{summary}</p>
    <ul className="flex min-w-0 items-end gap-2 overflow-x-auto pb-1" role="list">
      {buckets.map(bucket => {
        const height = bucket.count === 0 ? 4 : Math.max(12, Math.round(bucket.count / max * 100));
        return <li key={bucket.range} className="flex min-w-16 flex-1 flex-col items-center gap-2">
          <span className="text-sm font-medium text-foreground">{bucket.count}</span>
          <span aria-hidden="true" className="flex h-28 w-full items-end rounded-default bg-surface-soft">
            <span className="w-full rounded-default bg-primary transition-[height] duration-200" style={{ height: `${height}%` }} />
          </span>
          <span className="text-center text-xs text-text-muted">{bucket.label}</span>
          <span className="sr-only">{bucket.range}: {bucket.count} meetings held</span>
        </li>;
      })}
    </ul>
  </figure>;
}
export default ProductivityChart;