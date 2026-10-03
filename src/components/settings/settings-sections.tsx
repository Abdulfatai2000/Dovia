import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { settingsNavItems } from "./settings-nav";
import ProfileForm from "./profile-form";
import NotificationSettings from "./notification-settings";
import MeetingDefaultsForm from "./meeting-defaults-form";
import IntegrationsSettings from "./integrations-settings";
import SecuritySettings from "./security-settings";
import WorkspaceForm from "./workspace-form";

export interface SettingsSection {
  id: string;
  href: string;
  label: string;
  icon: LucideIcon;
  title: string;
  description: string;
  Content: ComponentType;
}

/** Card titles and copy for the all-in-one settings dashboard and the section routes. */
const sectionContent: Record<string, { title: string; description: string; Content: ComponentType }> = {
  account: {
    title: "Profile Information",
    description: "Update your personal information and how you appear in Dovia.",
    Content: ProfileForm,
  },
  notifications: {
    title: "Notification Preferences",
    description: "Choose what you want to be notified about.",
    Content: NotificationSettings,
  },
  "meeting-defaults": {
    title: "Meeting Defaults",
    description: "Set your preferred settings for new meetings.",
    Content: MeetingDefaultsForm,
  },
  integrations: {
    title: "Integrations",
    description: "Connect Dovia with the tools your team already uses.",
    Content: IntegrationsSettings,
  },
  security: {
    title: "Security",
    description: "Manage password and account security settings.",
    Content: SecuritySettings,
  },
  workspace: {
    title: "Workspace Preferences",
    description: "Customize your workspace and experience.",
    Content: WorkspaceForm,
  },
};

export const settingsSections: SettingsSection[] = settingsNavItems.map(item => ({
  id: item.id, href: item.href, label: item.label, icon: item.icon, ...sectionContent[item.id],
}));

export function getSettingsSection(id: string) {
  return settingsSections.find(section => section.id === id);
}

/** Shared card chrome so the dashboard and the section routes look identical. */
export function SettingsSectionCard({ section }: { section: SettingsSection }) {
  const Icon = section.icon;
  const { Content } = section;
  return <Card className="flex h-full flex-col p-[var(--card-padding)]">
    <div className="flex items-start gap-3">
      <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-default bg-surface-soft text-primary [&_svg]:size-4">
        <Icon />
      </span>
      <div className="min-w-0">
        <h2 className="dovia-card-title break-words">{section.title}</h2>
        <p className="mt-1 text-sm text-text-secondary">{section.description}</p>
      </div>
    </div>
    <div className="mt-5 min-w-0 flex-1">
      <Content />
    </div>
  </Card>;
}