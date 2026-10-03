"use client";
import { useState,type FormEvent } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import { teams } from "@/data/mock/meetings";
import { isValidEmail } from "@/components/auth/auth-validation";
export default function InviteMember() {
  const [open,setOpen]=useState(false);const [email,setEmail]=useState("");const [role,setRole]=useState("MEMBER");const [team,setTeam]=useState("");const [error,setError]=useState("");const [notice,setNotice]=useState(false);
  function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();if(!isValidEmail(email)){setError("Enter a valid email address.");requestAnimationFrame(()=>document.getElementById("invite-email")?.focus());return;}setError("");setOpen(false);setNotice(true);}
  return <><Button onClick={()=>{setOpen(true);setNotice(false);}}>Invite Member</Button><Modal open={open} onClose={()=>setOpen(false)} title="Invite a team member" description="Preview an invitation. No email will be sent."><form noValidate onSubmit={submit} className="space-y-4">{error&&<p role="alert" className="text-sm text-danger-foreground">{error}</p>}<Input id="invite-email" label="Email address" type="email" required value={email} error={error} onChange={e=>setEmail(e.target.value)} /><Select label="Role" value={role} onChange={e=>setRole(e.target.value)} options={[{value:"MEMBER",label:"Member"},{value:"ADMIN",label:"Admin"}]} /><Select label="Team (optional)" value={team} onChange={e=>setTeam(e.target.value)} options={[{value:"",label:"No team selected"},...teams.map(value=>({value,label:value}))]} /><div className="flex flex-wrap gap-3"><Button type="submit">Preview invitation</Button><Button variant="outline" onClick={()=>setOpen(false)}>Cancel</Button></div></form></Modal>{notice&&<div className="fixed inset-x-4 bottom-4 z-[var(--z-toast)] sm:left-auto"><Toast variant="info" title="Invitation UI is demo-only until backend email is connected." description="No email was sent and no member was added." onDismiss={()=>setNotice(false)} /></div>}</>;
}
