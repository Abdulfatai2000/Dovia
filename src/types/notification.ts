export type NotificationType="TASK_ASSIGNED"|"TASK_DUE_SOON"|"TASK_OVERDUE"|"TASK_COMPLETED"|"MEETING_REMINDER"|"MEETING_CREATED"|"MEETING_SUMMARY_READY"|"MEETING_CONFIRMED"|"MENTION"|"SYSTEM";
export type NotificationCategory="Tasks"|"Meetings"|"Mentions"|"System";
export interface DemoNotification {id:string;type:NotificationType;category:NotificationCategory;title:string;description:string;timestamp:string;href?:string;taskId?:string;meetingId?:string;read:boolean;}
