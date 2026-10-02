import type { ReactNode } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function AuthCard({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <Card shadow="sm" className="rounded-xl">
      <CardHeader className="space-y-2 px-6 pt-6 pb-5 sm:px-8 sm:pt-8 sm:pb-6">
        <h1 className="dovia-section-title">{title}</h1>
        <p className="text-sm leading-relaxed text-text-secondary">{description}</p>
      </CardHeader>
      <CardContent className="space-y-6 px-6 pb-6 sm:px-8 sm:pb-8">{children}</CardContent>
    </Card>
  );
}
