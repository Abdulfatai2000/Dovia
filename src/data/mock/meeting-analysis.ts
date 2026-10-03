import type { MeetingAnalysis } from "@/types/ai";

/** Illustrative fixture, not an analysis of the supplied notes or selected file. */
export function createMockAnalysis(meetingId: string): MeetingAnalysis {
  return {
    id: "analysis-" + meetingId, meetingId, status: "DRAFT",
    summary: "The team reviewed launch readiness, confirmed the current product direction, discussed payment integration, and outlined follow-up work for design, engineering, and marketing.",
    decisions: [
      { id: "decision-launch", description: "Launch date remains October 15." },
      { id: "decision-payments", description: "Use Paystack for payments." },
      { id: "decision-design", description: "Proceed with the current onboarding design." },
    ],
    actionItems: [
      { id: "action-dashboard", title: "Finalize dashboard UI", suggestedAssigneeName: "Abdulfatai", suggestedDeadline: "2026-10-07", priority: "HIGH", status: "IN_PROGRESS" },
      { id: "action-payments", title: "Integrate payment API", suggestedAssigneeName: "David Liu", suggestedDeadline: "2026-10-09", priority: "MEDIUM", status: "NOT_STARTED" },
      { id: "action-campaign", title: "Prepare campaign assets", suggestedAssigneeName: "Sarah Chen", suggestedDeadline: "2026-10-12", priority: "MEDIUM", status: "NOT_STARTED" },
      { id: "action-mobile", title: "Review mobile responsiveness", suggestedAssigneeName: "Daniel Kim", suggestedDeadline: "2026-10-10", priority: "LOW", status: "NOT_STARTED" },
    ],
    openQuestions: [
      { id: "question-finance", question: "Has finance approved the final pricing?" },
      { id: "question-api", question: "When will production API credentials be available?" },
      { id: "question-mobile", question: "Should the mobile launch happen at the same time as desktop?" },
    ],
    risks: [
      { id: "risk-api", description: "Payment API credentials are still pending.", severity: "HIGH" },
      { id: "risk-mobile", description: "Mobile responsiveness needs final QA.", severity: "MEDIUM" },
      { id: "risk-launch", description: "Launch date may be affected if integration testing slips.", severity: "HIGH" },
    ],
    importantNotes: ["Keep launch updates in one shared workspace.", "Review integration readiness before the next check-in."],
  };
}
export const sampleCompletedAnalysis: MeetingAnalysis = {
  id: "analysis-meeting-weekly", meetingId: "meeting-weekly", status: "CONFIRMED",
  summary: "The team reviewed weekly progress and agreed to bring launch blockers into the next strategy meeting.",
  decisions: [{ id: "weekly-decision", description: "Discuss remaining launch blockers at the next Product Strategy Sync." }],
  actionItems: [],
  openQuestions: [{ id: "weekly-question", question: "Which launch blockers need cross-team support?" }],
  risks: [{ id: "weekly-risk", description: "Outstanding integration dependencies need attention.", severity: "MEDIUM" }],
  importantNotes: ["Illustrative completed record from the demo dataset."],
};
