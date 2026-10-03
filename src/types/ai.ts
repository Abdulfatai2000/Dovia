import type { TaskPriority, TaskStatus } from "./task";

export interface MeetingDecision { id: string; description: string; }
export interface MeetingActionItem {
  id: string;
  title: string;
  description?: string;
  suggestedAssigneeId?: string;
  suggestedAssigneeName?: string;
  /** Explicit human selection, never inferred from the mock suggestion. */
  assigneeId?: string;
  suggestedDeadline?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
}
export interface OpenQuestion { id: string; question: string; }
export interface MeetingRisk { id: string; description: string; severity?: "LOW" | "MEDIUM" | "HIGH"; }
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
