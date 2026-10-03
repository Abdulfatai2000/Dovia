"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { useSettings } from "@/hooks/use-settings";
import { settingsSections } from "./settings-nav";
import ResetDemoData from "./reset-demo-data";

export default function SettingsOverview() {
  // Subscribing here keeps this page live if preferences are reset from this screen.
  useSettings();
  return <div className="min-w-0 space-y-8">
    <PageHeader title="Settings" description="Manage your account, preferences, integrations, and this demo workspace." />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {settingsSections.map(section => {
        const Icon = section.icon;
        return <Card key={section.href} className="flex h-full flex-col gap-3 p-[var(--card-padding)]">
          <span aria-hidden="true" className="flex size-9 items-center justify-center rounded-default bg-surface-soft text-primary [&_svg]:size-4"><Icon /></span>
          <h2 className="dovia-card-title"><Link href={section.href} className="rounded-sm hover:text-primary">{section.label}</Link></h2>
          <p className="text-sm leading-relaxed text-text-secondary">{section.description}</p>
          <Link href={section.href} className="mt-auto inline-flex items-center gap-1 rounded-sm text-sm font-medium">
            Open {section.label}<ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </Card>;
      })}
    </div>
    <ResetDemoData />
  </div>;
}