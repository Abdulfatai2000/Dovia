"use client";
import { useEffect, useState } from "react";
import type { MeetingAnalysis } from "@/types/ai";
import { createMockAnalysis } from "@/data/mock/meeting-analysis";
import { getConfirmedOutcome } from "@/services/meeting-outcome.service";
export function useMeetingAnalysis(meetingId: string) {
  const [analysis, setAnalysis] = useState<MeetingAnalysis | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (!active) return;
      try { setAnalysis(getConfirmedOutcome(meetingId) ?? createMockAnalysis(meetingId)); }
      catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to load demo outcome."); }
    });
    return () => { active = false; };
  }, [meetingId]);
  return { analysis, setAnalysis, error };
}
