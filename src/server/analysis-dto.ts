import type { MeetingAnalysis } from "@/types/ai";
import type { MeetingAnalysisRecord } from "./models/meeting-analysis";

type Member = { id: string; name: string; email: string };
export function analysisDto(record: MeetingAnalysisRecord, members: Member[]): MeetingAnalysis {
  const normalize = (value: string) => value.trim().toLowerCase();
  return {
    id: String(record._id), meetingId: String(record.meetingId), status: record.status === "CONFIRMED" ? "CONFIRMED" : "DRAFT",
    summary: record.summary ?? "",
    decisions: record.decisions.map((item, index) => ({ id: item.itemId ?? `decision-${index}`, description: item.text + (item.context ? `\n${item.context}` : "") })),
    actionItems: record.actionItems.map((item, index) => {
      const matches = members.filter(member => item.suggestedAssigneeEmail
        ? normalize(member.email) === normalize(item.suggestedAssigneeEmail)
        : Boolean(item.suggestedAssigneeName && normalize(member.name) === normalize(item.suggestedAssigneeName)));
      return { id: item.itemId ?? `action-${index}`, title: item.title, description: item.description ?? undefined,
        suggestedAssigneeName: item.suggestedAssigneeName ?? item.suggestedAssigneeEmail ?? undefined,
        suggestedAssigneeId: matches.length === 1 ? matches[0].id : undefined,
        assigneeId: record.status === "CONFIRMED" ? item.assigneeId?.toString() : undefined,
        suggestedDeadline: (record.status === "CONFIRMED" ? item.dueDate : item.suggestedDueDate)?.toISOString().slice(0, 10),
        priority: item.priority ?? "MEDIUM", status: item.status ?? "NOT_STARTED",
      };
    }),
    openQuestions: record.openQuestions.map((item, index) => ({ id: item.itemId ?? `question-${index}`, question: item.text })),
    risks: record.risks.map((item, index) => ({ id: item.itemId ?? `risk-${index}`, description: item.text + (item.mitigation ? `\nMitigation: ${item.mitigation}` : ""), severity: item.severity as "LOW" | "MEDIUM" | "HIGH" })),
    importantNotes: (record.notes ?? "").split("\n").filter(Boolean),
    confirmedAt: record.confirmedAt?.toISOString(), confirmedBy: record.confirmedBy?.toString(),
  };
}
