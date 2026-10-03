"use client";

import { PageHeader } from "@/components/ui/page-header";
import { SettingsTabs } from "./settings-nav";
import { settingsSections, SettingsSectionCard } from "./settings-sections";
import ResetDemoData from "./reset-demo-data";

/**
 * All-in-one settings workspace: one header, one navigation bar, and every settings
 * section on a single page. The individual /settings/* routes reuse the same cards.
 */
export default function SettingsDashboard() {
  return <div className="min-w-0 space-y-6">
    <PageHeader title="Settings" description="Manage your account, workspace, and preferences." />
    <SettingsTabs />

    <div className="grid items-start gap-4 lg:grid-cols-2">
      {settingsSections.map(section => <SettingsSectionCard key={section.id} section={section} />)}
    </div>

    <div className="min-w-0">
      <ResetDemoData />
    </div>
  </div>;
}