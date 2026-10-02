import type { TaskPriority } from "./task";

export interface MeetingDecision { id: string; description: string; }
export interface MeetingActionItem {
  id: string;
  title: string;
  description?: string;
  suggestedAssigneeId?: string;
  suggestedDeadline?: string;
  priority?: TaskPriority;
}
export interface OpenQuestion { id: string; question: string; }
export interface MeetingRisk { id: string; description: string; }

// Generated analysis remains a draft until an organizer reviews and confirms it.
export interface MeetingAnalysis {
  id: string;
  meetingId: string;
  status: "DRAFT" | "CONFIRMED";
  summary: string;
  decisions: MeetingDecision[];
  actionItems: MeetingActionItem[];
  openQuestions: OpenQuestion[];
  risks: MeetingRisk[];
  importantNotes: string[];
  confirmedBy?: string;
  confirmedAt?: string;
}
