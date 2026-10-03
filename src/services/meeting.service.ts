import { seedMeetings } from "@/data/mock/meetings";
import type { CreateMeetingInput, Meeting, MeetingContent } from "@/types/meeting";

const MEETINGS_KEY = "dovia_demo_meetings";
const CONTENT_KEY = "dovia_demo_meeting_content_";

function isMeeting(value: unknown): value is Meeting {
  if (!value || typeof value !== "object") return false;
  const m = value as Record<string, unknown>;
  return typeof m.id === "string" && typeof m.title === "string" && typeof m.date === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(m.date) && !Number.isNaN(Date.parse(m.date)) &&
    typeof m.startTime === "string" && /^\d{2}:\d{2}$/.test(m.startTime) &&
    typeof m.duration === "number" && typeof m.meetingType === "string" &&
    typeof m.team === "string" && typeof m.platform === "string" &&
    ["DRAFT", "SCHEDULED", "IN_PROGRESS", "PROCESSING", "REVIEW", "COMPLETED", "CANCELLED"].includes(String(m.status)) &&
    Array.isArray(m.participants) && m.participants.every(p => p && typeof p.userId === "string") &&
    Array.isArray(m.agenda) && m.agenda.every(a => a && typeof a.id === "string" && typeof a.title === "string") &&
    Array.isArray(m.files) && m.files.every(f => f && typeof f.name === "string" && typeof f.type === "string") &&
    Array.isArray(m.carryOver) && m.carryOver.length === 0;
}
function demoMeetings(): Meeting[] {
  if (typeof window === "undefined") return [];
  try {
    const data: unknown = JSON.parse(localStorage.getItem(MEETINGS_KEY) ?? "[]");
    if (!Array.isArray(data) || !data.every(isMeeting)) throw new Error("Invalid demo data");
    return data;
  } catch {
    throw new Error("Unable to read demo meetings. Check browser storage or clear the Dovia demo data and try again.");
  }
}
export function getMeetings(): Meeting[] { return [...demoMeetings(), ...seedMeetings]; }
export function getMeeting(id: string): Meeting | undefined { return getMeetings().find(meeting => meeting.id === id); }
export function createMeeting(input: CreateMeetingInput): Meeting {
  const meeting: Meeting = { ...input, id: `demo-${crypto.randomUUID()}`, status: "SCHEDULED" };
  try { localStorage.setItem(MEETINGS_KEY, JSON.stringify([meeting, ...demoMeetings()])); }
  catch { throw new Error("The demo meeting could not be saved in this browser. Allow browser storage and try again."); }
  return meeting;
}
export function saveMeetingContent(id: string, content: MeetingContent) {
  try { localStorage.setItem(CONTENT_KEY + id, JSON.stringify(content)); }
  catch { throw new Error("Content could not be saved in this browser. Keep a copy of your notes and try again."); }
}
export function getMeetingContent(id: string): MeetingContent | null {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(CONTENT_KEY + id) ?? "null");
    if (value === null) return null;
    if (!value || typeof value !== "object") throw new Error();
    const content = value as Record<string, unknown>;
    if (!["paste", "manual", "upload"].includes(String(content.mode)) || typeof content.text !== "string") throw new Error();
    if (content.file) {
      const file = content.file as Record<string, unknown>;
      if (typeof file.id !== "string" || typeof file.name !== "string" || typeof file.type !== "string" || typeof file.size !== "number") throw new Error();
    }
    return value as MeetingContent;
  } catch { throw new Error("Saved demo content could not be read. You can enter fresh notes below."); }
}
