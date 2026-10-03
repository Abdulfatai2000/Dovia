import type { MeetingAnalysis } from "@/types/ai";
import type { Task } from "@/types/task";
import { sampleCompletedAnalysis } from "@/data/mock/meeting-analysis";
import { users } from "@/data/mock/users";

const KEY = "dovia_demo_meeting_outcomes";
export const OUTCOMES_CHANGED = "dovia-demo-outcomes-changed";
const record = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === "object" && !Array.isArray(value);
const priorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];
const statuses = ["NOT_STARTED", "IN_PROGRESS", "BLOCKED", "COMPLETED", "OVERDUE"];
const validDate = (value: unknown) => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));
function isAnalysis(value: unknown): value is MeetingAnalysis {
  if (!record(value) || typeof value.id !== "string" || typeof value.meetingId !== "string" || value.status !== "CONFIRMED" || typeof value.summary !== "string") return false;
  const list = (items: unknown, field: string) => Array.isArray(items) && items.every((item: unknown) => record(item) && typeof item.id === "string" && typeof item[field] === "string");
  return list(value.decisions, "description") && list(value.openQuestions, "question") &&
    list(value.risks, "description") && Array.isArray(value.risks) && value.risks.every((risk: unknown) => record(risk) && (risk.severity === undefined || ["LOW","MEDIUM","HIGH"].includes(String(risk.severity)))) &&
    Array.isArray(value.importantNotes) && value.importantNotes.every((note: unknown) => typeof note === "string") &&
    Array.isArray(value.actionItems) && value.actionItems.every((item: unknown) => record(item) &&
      typeof item.id === "string" && typeof item.title === "string" &&
      typeof item.assigneeId === "string" && users.some(user => user.id === item.assigneeId) &&
      (item.suggestedAssigneeName === undefined || typeof item.suggestedAssigneeName === "string") &&
      validDate(item.suggestedDeadline) && priorities.includes(String(item.priority)) && statuses.includes(String(item.status))) &&
    (value.confirmedAt === undefined || typeof value.confirmedAt === "string") &&
    (value.confirmedBy === undefined || typeof value.confirmedBy === "string");
}
export function getConfirmedOutcomes(): MeetingAnalysis[] {
  if (typeof window === "undefined") return [sampleCompletedAnalysis];
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    if (!Array.isArray(stored) || !stored.every(isAnalysis)) throw new Error();
    const outcomes = new Map<string, MeetingAnalysis>([[sampleCompletedAnalysis.meetingId, sampleCompletedAnalysis]]);
    stored.forEach(outcome => outcomes.set(outcome.meetingId, outcome));
    return [...outcomes.values()];
  } catch { throw new Error("Unable to read confirmed demo outcomes. Check browser storage before continuing."); }
}
export function getConfirmedOutcome(meetingId: string) {
  return getConfirmedOutcomes().find(outcome => outcome.meetingId === meetingId);
}
export function validateOutcome(analysis: MeetingAnalysis): string | null {
  if (!analysis.summary.trim()) return "Add a meeting summary before confirming.";
  if (analysis.decisions.some(item => !item.description.trim())) return "Complete or remove blank decisions.";
  if (analysis.openQuestions.some(item => !item.question.trim())) return "Complete or remove blank open questions.";
  if (analysis.risks.some(item => !item.description.trim())) return "Complete or remove blank risks.";
  if (new Set(analysis.actionItems.map(item => item.id)).size !== analysis.actionItems.length) return "Action items must have unique IDs.";
  for (const [index, item] of analysis.actionItems.entries()) {
    if (!item.title.trim()) return `Add a title for action item ${index + 1}.`;
    if (!users.some(user => user.id === item.assigneeId)) return `Choose a reviewed owner for action item ${index + 1}.`;
    if (!validDate(item.suggestedDeadline)) return `Choose a deadline for action item ${index + 1}.`;
    if (!priorities.includes(item.priority ?? "") || !statuses.includes(item.status ?? "")) return `Choose priority and status for action item ${index + 1}.`;
  }
  return null;
}
export function confirmMeetingOutcome(analysis: MeetingAnalysis): MeetingAnalysis {
  const error = validateOutcome(analysis);
  if (error) throw new Error(error);
  const confirmed: MeetingAnalysis = { ...analysis, status: "CONFIRMED", confirmedAt: new Date().toISOString(), confirmedBy: "user-abdulfatai" };
  const outcomes = getConfirmedOutcomes().filter(outcome => outcome.meetingId !== analysis.meetingId);
  try {
    // One atomic write is the source of truth for completed status, outcome, and derived tasks.
    localStorage.setItem(KEY, JSON.stringify([...outcomes, confirmed]));
  } catch { throw new Error("The outcome could not be saved in this browser. Your edits are still here; allow storage and try again."); }
  window.dispatchEvent(new Event(OUTCOMES_CHANGED));
  return confirmed;
}
export function getConfirmedDemoTasks(): Task[] {
  return getConfirmedOutcomes().flatMap(outcome => outcome.actionItems.map(item => ({
    id: `confirmed:${outcome.meetingId}:${item.id}`, meetingId: outcome.meetingId,
    title: item.title, description: item.description, assigneeId: item.assigneeId, dueDate: item.suggestedDeadline,
    completedAt: item.status === "COMPLETED" ? outcome.confirmedAt : undefined,
    priority: item.priority ?? "MEDIUM", status: item.status ?? "NOT_STARTED",
  })));
}

