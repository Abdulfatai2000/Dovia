import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
export default function StatCard({ label, value, description, icon }: { label: string; value: number; description: string; icon: ReactNode }) {
  return <Card className="p-5"><div className="flex items-start justify-between gap-3"><p className="text-sm font-medium text-text-secondary">{label}</p>{icon}</div>
    <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p><p className="mt-2 text-xs text-text-muted">{description}</p></Card>;
}
