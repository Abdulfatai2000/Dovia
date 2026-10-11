import { apiFetch } from "@/lib/api-client";
import { setCurrentUserId } from "@/lib/task-utils";
import type { DemoUser } from "@/data/mock/users";
let members:DemoUser[]=[];
let currentUser:DemoUser={id:"",name:"",email:"",role:"",department:"",status:"Active"};
export async function loadWorkspaceMembers(){
 const [people,session]=await Promise.all([apiFetch<DemoUser[]>("/api/workspace/members"),fetch("/api/auth/session",{cache:"no-store"}).then(response=>response.json())]);
 members=people;currentUser=members.find(member=>member.id===session.user?.id)??currentUser;setCurrentUserId(currentUser.id);return members;
}
export function clearWorkspaceMembers(){members=[];currentUser={id:"",name:"",email:"",role:"",department:"",status:"Active"};setCurrentUserId("");}
export function getTeamMembers(){return members;}
export function getTeamMember(id:string){return members.find(member=>member.id===id);}
export const getUser=getTeamMember;
export const getCurrentUser=()=>currentUser;
