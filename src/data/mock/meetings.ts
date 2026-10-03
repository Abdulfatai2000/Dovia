import type { Meeting } from "@/types/meeting";

// Fixed demo calendar: never derived from the server's clock.
export const DEMO_TODAY = "2026-10-05";
export const meetingTypes = ["Team Sync", "Project Review", "Planning", "Client Meeting", "Leadership Meeting", "One-on-One", "Other"];
export const platforms = ["Google Meet", "Microsoft Teams", "Zoom", "In Person", "Other"];
export const teams = ["Product", "Design", "Engineering", "Marketing", "Customer Success"];
const base = {
  description: "Align on priorities, surface blockers, and leave with clear owners and next steps.",
  duration: 45, meetingType: "Team Sync", platform: "Google Meet", team: "Product",
  participants: [{ userId: "user-abdulfatai", organizer: true }, { userId: "user-sarah" }, { userId: "user-marcus" }, { userId: "user-priya" }, { userId: "user-daniel" }, { userId: "user-david" }],
  agenda: [
    { id: "recap", title: "Welcome & quick recap", time: "10:00–10:05" },
    { id: "insights", title: "Market insights & key learnings", time: "10:05–10:15" },
    { id: "strategy", title: "Go-to-market strategy", time: "10:15–10:30" },
    { id: "launch", title: "Launch readiness & execution plan", time: "10:30–10:40" },
    { id: "next", title: "Next steps & action items", time: "10:40–10:45" },
  ],
  files: [
    { id: "brief", name: "Product Launch Brief v2.0", type: "Google Docs" },
    { id: "plan", name: "Go-to-Market Plan", type: "PDF" },
    { id: "research", name: "Market Research Summary", type: "Spreadsheet" },
  ],
  carryOver: [], tags: ["Launch", "Strategy"],
} satisfies Partial<Meeting>;
export const seedMeetings: Meeting[] = [
  { ...base, id: "meeting-product-strategy", title: "Product Strategy Sync", date: DEMO_TODAY, startTime: "10:00", status: "SCHEDULED",
    meetingUrl: "https://meet.google.com/demo-preview", previousMeetingTitle: "Product Strategy Sync · September 28",
    carryOver: [
      { id: "pricing", title: "Finalize pricing strategy options", kind: "Task", status: "OVERDUE", ownerId: "user-sarah", dueDate: "2026-10-02" },
      { id: "analysis", title: "Complete competitive analysis", kind: "Task", status: "IN_PROGRESS", ownerId: "user-david", dueDate: "2026-10-07" },
      { id: "launch-date", title: "Target launch date", kind: "Decision", status: "NEEDS_DECISION" },
    ] },
  { ...base, id: "meeting-design-review", title: "Design Review", date: DEMO_TODAY, startTime: "14:00", duration: 30, status: "SCHEDULED", platform: "Zoom", team: "Design", meetingType: "Project Review", agenda: [{ id: "design", title: "Review onboarding flow" }, { id: "feedback", title: "Discuss accessibility feedback" }] },
  { ...base, id: "meeting-roadmap", title: "Q4 Roadmap Planning", date: "2026-10-08", startTime: "11:00", duration: 60, status: "SCHEDULED", meetingType: "Planning", agenda: [{ id: "priorities", title: "Agree on quarterly priorities" }] },
  { ...base, id: "meeting-client-review", title: "Customer Feedback Review", date: "2026-10-09", startTime: "15:00", status: "SCHEDULED", platform: "Microsoft Teams", team: "Customer Success", meetingType: "Client Meeting", agenda: [{ id: "customer", title: "Review customer feedback and next steps" }] },
  { ...base, id: "meeting-marketing", title: "Marketing Sync", date: "2026-10-01", startTime: "09:00", status: "REVIEW", team: "Marketing" },
  { ...base, id: "meeting-launch", title: "Product Launch Planning", date: "2026-10-12", startTime: "10:00", status: "DRAFT", meetingType: "Planning" },
  { ...base, id: "meeting-weekly", title: "Weekly Team Check-in", date: "2026-10-02", startTime: "09:30", status: "COMPLETED" },
];
