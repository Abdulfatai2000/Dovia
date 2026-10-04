import { users } from "@/data/mock/users";
import { getProfileSettings } from "./settings.service";
import { CURRENT_USER_ID } from "@/lib/task-utils";
export function getTeamMembers(){
  // A damaged preferences record must not prevent opening Settings to reset it.
  try { const profile=getProfileSettings();return users.map(user=>user.id===CURRENT_USER_ID?{...user,name:profile.name,email:profile.email,role:profile.jobTitle}:user); }
  catch { return users; }
}
export function getTeamMember(id:string){return getTeamMembers().find(user=>user.id===id);}
export const getUser=getTeamMember;
export const getCurrentUser=()=>getTeamMember(CURRENT_USER_ID)!;
