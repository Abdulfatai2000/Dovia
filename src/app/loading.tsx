import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return <main role="status" className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8 md:px-6 lg:px-8">
    <span className="sr-only">Loading Dovia…</span>
    <Skeleton className="h-9 w-2/5" />
    <Skeleton className="h-5 w-3/5" />
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-28" />)}</div>
    <Skeleton className="h-72" />
  </main>;
}