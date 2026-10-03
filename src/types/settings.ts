export interface ProfileSettings {name:string;email:string;jobTitle:string;timezone:string;}
export interface WorkspaceSettings {name:string;language:"English";timezone:string;dateFormat:"DD/MM/YYYY"|"MM/DD/YYYY"|"YYYY-MM-DD";weekStartsOn:"Monday"|"Sunday";appearance:"Light";}
export interface MeetingDefaults {duration:number;meetingType:string;platform:string;reminder:number;autoOpenReview:boolean;autoGenerate:boolean;}
export interface NotificationPreferences {meetingReminders:boolean;taskAssignments:boolean;taskDueReminders:boolean;mentions:boolean;summaries:boolean;followUps:boolean;productUpdates:boolean;}
export interface DemoSettings {profile:ProfileSettings;workspace:WorkspaceSettings;meetingDefaults:MeetingDefaults;notifications:NotificationPreferences;}
