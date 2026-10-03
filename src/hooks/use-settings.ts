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