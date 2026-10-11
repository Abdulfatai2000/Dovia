"use client";

import { useCallback } from "react";
import { useDemoQuery } from "./use-demo-query";
import { getSettings } from "@/services/settings.service";
import type { DemoSettings } from "@/types/settings";

/** Single subscription for every settings surface, backed by the settings service. */
export function useSettings() {
  const load = useCallback(() => getSettings(), []);
  return useDemoQuery<DemoSettings>(load);
}

export interface IntegrationStatusInfo {
  provider: "GOOGLE_CALENDAR" | "MICROSOFT_CALENDAR" | "SLACK";
  configured: boolean;
  connected: boolean;
  status: "CONNECTED" | "DISCONNECTED" | "RECONNECT_REQUIRED" | "ERROR";
  providerAccountId?: string;
  tokenExpiresAt?: string;
  error?: string;
}

export function useIntegrationStatus() {
  const load = useCallback(async () => {
    const response = await fetch("/api/integrations/status");
    if (!response.ok) {
      throw new Error("Failed to fetch integration status");
    }
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || "Failed to fetch integration status");
    }
    return data.data as IntegrationStatusInfo[];
  }, []);

  return useDemoQuery<IntegrationStatusInfo[]>(load);
}