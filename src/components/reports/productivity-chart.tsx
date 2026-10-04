export interface ProductivityBucket { label: string; range: string; count: number; }
export interface ProductivityChartProps { buckets: ProductivityBucket[]; title?: string; description?: string; grouping?: string; }

/**
 * Dependency-free weekly bar chart. Rendered as a list so every bar is reachable by
 * screen readers, with the visual bar marked aria-hidden rather than color-coded only.
 */
export function ProductivityChart({ buckets, title = "Meetings held per week", description, grouping }: ProductivityChartProps) {
  const max = Math.max(1, ...buckets.map(bucket => bucket.count));
  const peak = buckets.reduce((best, bucket) => bucket.count > best.count ? bucket : best, buckets[0]);
  const summary = buckets.length
    ? `${buckets.reduce((total, bucket) => total + bucket.count, 0)} meetings held across ${buckets.length} weeks.${peak?.count ? ` Highest week: ${peak.label}.` : ""}`
    : "No meetings were held in this period.";
  return <figure className="min-w-0">
    <figcaption className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0 space-y-1">
        <h2 className="dovia-card-title">{title}</h2>
        {description && <p className="text-sm text-text-secondary">{description}</p>}
      </div>
      {grouping && <span className="rounded-pill bg-surface-soft px-3 py-1 text-xs font-medium text-text-secondary">{grouping}</span>}
    </figcaption>
    <p className="mt-3 text-sm text-text-secondary">{summary}</p>
    <ul className="relative mt-4 flex min-w-0 items-end gap-2 overflow-x-auto pb-1" role="list" tabIndex={0} aria-label="Weekly meeting output; scroll to see all weeks">
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
