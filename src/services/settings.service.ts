import { users } from "@/data/mock/users";
import { meetingTypes,platforms } from "@/data/mock/meetings";
import { CURRENT_USER_ID } from "@/lib/task-utils";
import { isRecord,readDemo,writeDemo } from "@/lib/demo-store";
import type { DemoSettings,ProfileSettings,WorkspaceSettings,MeetingDefaults,NotificationPreferences } from "@/types/settings";
const user=users.find(user=>user.id===CURRENT_USER_ID)!;
export const timezones=["Africa/Lagos","UTC","Europe/London","America/New_York","Asia/Kolkata"];
export const defaultSettings:DemoSettings={profile:{name:user.name,email:user.email,jobTitle:user.role,timezone:"Africa/Lagos"},workspace:{name:"Dovia Workspace",language:"English",timezone:"Africa/Lagos",dateFormat:"DD/MM/YYYY",weekStartsOn:"Monday",appearance:"Light"},meetingDefaults:{duration:45,meetingType:"Team Sync",platform:"Google Meet",reminder:15,autoOpenReview:true,autoGenerate:false},notifications:{meetingReminders:true,taskAssignments:true,taskDueReminders:true,mentions:true,summaries:true,followUps:true,productUpdates:false}};
function valid(value:unknown):value is DemoSettings {
  if(!isRecord(value)||!isRecord(value.profile)||!isRecord(value.workspace)||!isRecord(value.meetingDefaults)||!isRecord(value.notifications))return false;
  const p=value.profile,w=value.workspace,m=value.meetingDefaults;
  return [p.name,p.email,p.jobTitle,p.timezone,w.name,w.timezone].every(v=>typeof v==="string")&&w.language==="English"&&["DD/MM/YYYY","MM/DD/YYYY","YYYY-MM-DD"].includes(String(w.dateFormat))&&["Monday","Sunday"].includes(String(w.weekStartsOn))&&w.appearance==="Light"&&[15,30,45,60,90,120].includes(Number(m.duration))&&meetingTypes.includes(String(m.meetingType))&&platforms.includes(String(m.platform))&&[0,5,15,30,60].includes(Number(m.reminder))&&typeof m.autoOpenReview==="boolean"&&typeof m.autoGenerate==="boolean"&&Object.keys(defaultSettings.notifications).every(key=>typeof (value.notifications as Record<string,unknown>)[key]==="boolean");
}
const KEY="dovia_demo_settings";
export const getSettings=()=>readDemo(KEY,defaultSettings,valid);
function save<K extends keyof DemoSettings>(key:K,value:DemoSettings[K]){const settings={...getSettings(),[key]:value};if(!valid(settings))throw new Error("Choose valid settings values.");writeDemo(KEY,settings);}
export const getProfileSettings=()=>getSettings().profile;
export function updateProfileSettings(value:ProfileSettings){if(!value.name.trim()||!/^\S+@\S+\.\S+$/.test(value.email)||!timezones.includes(value.timezone))throw new Error("Enter a name, valid email, and timezone.");save("profile",{...value,name:value.name.trim(),email:value.email.trim()});}
export const getWorkspaceSettings=()=>getSettings().workspace;
export function updateWorkspaceSettings(value:WorkspaceSettings){if(!value.name.trim()||!timezones.includes(value.timezone))throw new Error("Enter a workspace name and timezone.");save("workspace",{...value,name:value.name.trim()});}
export const getMeetingDefaults=()=>getSettings().meetingDefaults;
export const updateMeetingDefaults=(value:MeetingDefaults)=>save("meetingDefaults",value);
export const getNotificationPreferences=()=>getSettings().notifications;
export const updateNotificationPreferences=(value:NotificationPreferences)=>save("notifications",value);
