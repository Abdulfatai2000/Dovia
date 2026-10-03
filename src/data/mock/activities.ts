export interface Activity { id: string; actorId: string; action: string; entity: string; href: string; time: string; }
export const activities: Activity[] = [
  { id: "activity-1", actorId: "user-sarah", action: "commented on", entity: "Finalize product requirements", href: "/tasks/task-product-requirements", time: "2 hours ago" },
  { id: "activity-2", actorId: "user-marcus", action: "added an agenda item to", entity: "Design Review", href: "/meetings/meeting-design-review", time: "3 hours ago" },
  { id: "activity-3", actorId: "user-abdulfatai", action: "created", entity: "Product Strategy Sync", href: "/meetings/meeting-product-strategy", time: "4 hours ago" },
  { id: "activity-4", actorId: "user-priya", action: "updated the deadline for", entity: "Prepare campaign assets", href: "/tasks/task-campaign-assets", time: "Yesterday" },
  { id: "activity-5", actorId: "user-daniel", action: "reviewed", entity: "Research competitor analysis", href: "/tasks/task-research", time: "Yesterday" },
];
