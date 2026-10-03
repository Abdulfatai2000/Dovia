import { users } from "@/data/mock/users";
export function getTeamMembers(){return users;}
export function getTeamMember(id:string){return users.find(user=>user.id===id);}
