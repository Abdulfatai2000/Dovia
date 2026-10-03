export type MeetingStatus = "DRAFT" | "SCHEDULED" | "IN_PROGRESS" | "PROCESSING" | "REVIEW" | "COMPLETED" | "CANCELLED";

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  date: string;
  startTime?: string;
  duration?: number;
  status: MeetingStatus;
  meetingType: string;
  platform: string;
  team: string;
  participants: Participant[];
  agenda: AgendaItem[];
  files: MeetingFile[];
  carryOver: CarryOverItem[];
  tags?: string[];
  meetingUrl?: string;
  previousMeetingTitle?: string;
  sendInvitations?: boolean;
  recurring?: boolean;
}

export interface Participant { userId: string; organizer?: boolean; }
export interface AgendaItem { id: string; title: string; time?: string; }
export interface MeetingFile { id: string; name: string; type: string; size?: number; }
export interface CarryOverItem {
  id: string;
  title: string;
  kind: "Task" | "Decision";
  status: "OVERDUE" | "IN_PROGRESS" | "NEEDS_DECISION";
  ownerId?: string;
  dueDate?: string;
}
export interface MeetingContent {
  mode: "paste" | "upload" | "manual";
  text: string;
  file?: MeetingFile;
}
export type CreateMeetingInput = Omit<Meeting, "id" | "status">;
