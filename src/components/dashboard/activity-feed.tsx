import Link from "next/link";
import type { Activity } from "@/data/mock/activities";
import { getUser } from "@/data/mock/users";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
export default function ActivityFeed({ activities, loading = false }: { activities: Activity[]; loading?: boolean }) {
  if (loading) return <Skeleton className="h-48" />;
  if (!activities.length) return <EmptyState title="No recent activity" description="Meeting and task updates will appear here." />;
  return <Card><ul className="divide-y divide-border">{activities.map(activity => <li key={activity.id} className="flex items-start gap-3 p-5">
    <Avatar name={getUser(activity.actorId)?.name ?? "Team member"} size="sm" />
    <div className="min-w-0 text-sm"><p><span className="font-medium">{getUser(activity.actorId)?.name}</span> <span className="text-text-secondary">{activity.action}</span> <Link href={activity.href}>{activity.entity}</Link></p><p className="mt-1 text-xs text-text-muted">{activity.time} · Demo activity</p></div>
  </li>)}</ul></Card>;
}
