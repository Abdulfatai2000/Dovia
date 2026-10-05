export const MembershipRole = ["OWNER", "ADMIN", "MEMBER"] as const;
export type MembershipRole = (typeof MembershipRole)[number];

export const MembershipStatus = ["ACTIVE", "PENDING", "REVOKED"] as const;
export type MembershipStatus = (typeof MembershipStatus)[number];

export const MeetingStatus = ["DRAFT", "SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"] as const;
export type MeetingStatus = (typeof MeetingStatus)[number];

export const MeetingPlatform = ["GOOGLE_MEET", "MICROSOFT_TEAMS", "ZOOM", "IN_PERSON", "OTHER"] as const;
export type MeetingPlatform = (typeof MeetingPlatform)[number];

export const MeetingType = ["STANDARD", "ONE_ON_ONE", "WORKSHOP", "RETROSPECTIVE", "INTERVIEW", "OTHER"] as const;
export type MeetingType = (typeof MeetingType)[number];

export const TaskStatus = ["NOT_STARTED", "IN_PROGRESS", "BLOCKED", "COMPLETED"] as const;
export type TaskStatus = (typeof TaskStatus)[number];

export const TaskPriority = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;
export type TaskPriority = (typeof TaskPriority)[number];

export const TaskSource = ["MEETING", "MANUAL"] as const;
export type TaskSource = (typeof TaskSource)[number];

export const NotificationType = [
  "TASK_ASSIGNED",
  "TASK_DUE_SOON",
  "TASK_OVERDUE",
  "TASK_COMPLETED",
  "MEETING_REMINDER",
  "MEETING_CREATED",
  "MEETING_SUMMARY_READY",
  "MEETING_CONFIRMED",
  "MENTION",
  "SYSTEM",
] as const;
export type NotificationType = (typeof NotificationType)[number];

export const NotificationCategory = ["Tasks", "Meetings", "Mentions", "System"] as const;
export type NotificationCategory = (typeof NotificationCategory)[number];

export const AnalysisStatus = ["DRAFT", "CONFIRMED", "SUPERSEDED"] as const;
export type AnalysisStatus = (typeof AnalysisStatus)[number];

export const EmailVerificationPurpose = ["EMAIL_VERIFICATION", "PASSWORD_RESET"] as const;
export type EmailVerificationPurpose = (typeof EmailVerificationPurpose)[number];

export const MeetingContentType = ["PASTED_NOTES", "MANUAL_NOTES", "TRANSCRIPT", "FILE"] as const;
export type MeetingContentType = (typeof MeetingContentType)[number];

export const ActivityType = [
  "MEETING_CREATED",
  "MEETING_UPDATED",
  "MEETING_COMPLETED",
  "MEETING_CANCELLED",
  "TASK_CREATED",
  "TASK_UPDATED",
  "TASK_COMPLETED",
  "TASK_ASSIGNED",
  "DECISION_CONFIRMED",
  "WORKSPACE_CREATED",
  "MEMBER_JOINED",
  "MEMBER_REMOVED",
  "ROLE_CHANGED",
] as const;
export type ActivityType = (typeof ActivityType)[number];

export const ActivityEntityType = ["meeting", "task", "decision", "workspace", "membership"] as const;
export type ActivityEntityType = (typeof ActivityEntityType)[number];

export const UserStatus = ["ACTIVE", "INACTIVE", "USPENDED"] as const;
export type UserStatus = (typeof UserStatus)[number];

export const FileStorageProvider = ["local", "s3", "cloudinary", "vercel_blob"] as const;
export type FileStorageProvider = (typeof FileStorageProvider)[number];

export const OTP_LENGTH = 6;
export const OTP_EXPIRY_SECONDS = 120;
export const OTP_RESEND_COOLDOWN_SECONDS = 60;
export const OTP_MAX_ATTEMPTS = 5;
