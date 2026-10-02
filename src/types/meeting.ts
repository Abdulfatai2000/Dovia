export type MeetingStatus = "DRAFT" | "SCHEDULED" | "IN_PROGRESS" | "PROCESSING" | "REVIEW" | "COMPLETED" | "CANCELLED";

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  date: string;
  startTime?: string;
  duration?: number;
  status: MeetingStatus;
}
