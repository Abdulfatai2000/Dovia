"use client";

import { Monitor, Moon, Palette, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Dropdown, type DropdownItem } from "@/components/ui/dropdown";

export type ThemeMode = "light" | "dark" | "system";

/** Single source of truth shared by the topbar control and Settings → Workspace → Appearance. */
export const themeModes: readonly { value: ThemeMode; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export function useThemeMode() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mode: ThemeMode = theme === "light" || theme === "dark" ? theme : "system";
  return { mode, resolvedTheme, setTheme };
}

export function themeButtonLabel(mode: ThemeMode, resolvedTheme?: string) {
  if (mode === "system") return `Theme: system (${resolvedTheme === "dark" ? "dark" : "light"})`;
  return `Theme: ${mode}`;
}

export function ThemeToggle({ variant = "icon", className }: { variant?: "icon" | "inline"; className?: string }) {
  const { mode, resolvedTheme, setTheme } = useThemeMode();
  const [mounted, setMounted] = useState(false);
  if (!mounted) setMounted(true);
  const items: DropdownItem[] = themeModes.map(entry => ({
    id: entry.value,
    label: entry.label,
    description: entry.value === "system" ? "Follows your device appearance." : `Always use ${entry.label.toLowerCase()} appearance.`,
    icon: <entry.icon />,
    selected: mounted && mode === entry.value,
    onSelect: () => setTheme(entry.value),
  }));
  return <Dropdown
    className={className}
    label={themeButtonLabel(mode, resolvedTheme)}
    triggerDescription="Choose the Dovia colour theme"
    variant="ghost"
    iconOnly={variant === "icon"}
    menuSize="sm"
    trigger={<Palette aria-hidden="true" />}
    items={items} />;
}

export default ThemeToggle;