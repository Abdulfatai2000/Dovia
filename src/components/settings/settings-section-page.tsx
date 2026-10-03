"use client";

import { PageHeader } from "@/components/ui/page-header";
import { SettingsTabs } from "./settings-nav";
import { getSettingsSection, SettingsSectionCard } from "./settings-sections";

/** Focused view of one settings section, using the same header, navigation, and card as the dashboard. */
export default function SettingsSectionPage({ sectionId }: { sectionId: string }) {
  const section = getSettingsSection(sectionId);
  if (!section) return null;
  return <div className="min-w-0 space-y-6">
    <PageHeader title={section.title} description={section.description} />
    <SettingsTabs />
    <SettingsSectionCard section={section} />
  </div>;
}