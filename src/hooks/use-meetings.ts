"use client";

import { useEffect, useState } from "react";
import { getMeetings } from "@/services/meeting.service";
import { OUTCOMES_CHANGED } from "@/services/meeting-outcome.service";
import type { Meeting } from "@/types/meeting";

export function useMeetings() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    const load = () => {
      Promise.resolve().then(() => {
        if (!active) return;
        try { setMeetings(getMeetings()); setError(""); }
        catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to load demo meetings."); }
        finally { setLoading(false); }
      });
    };
    load();
    window.addEventListener("storage", load);
    window.addEventListener(OUTCOMES_CHANGED, load);
    return () => { active = false; window.removeEventListener("storage", load); window.removeEventListener(OUTCOMES_CHANGED, load); };
  }, []);
  return { meetings, loading, error };
}
