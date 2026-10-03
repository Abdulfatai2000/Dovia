import Link from "next/link";
import type { DemoUser } from "@/data/mock/users";
import type { Task } from "@/types/task";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table,TableHeader,TableHead,TableRow,TableCell,TableBody,TableCaption } from "@/components/ui/table";
import MemberCard from "./member-card";
export default function TeamTable({members,tasks}:{members:DemoUser[];tasks:Task[]}) {
  const count=(id:string)=>tasks.filter(task=>task.assigneeId===id&&task.status!=="COMPLETED").length;
  return <><div className="grid gap-4 sm:grid-cols-2 lg:hidden">{members.map(member=><MemberCard key={member.id} member={member} openTasks={count(member.id)} />)}</div><div className="hidden lg:block"><Table containerLabel="Team members" className="min-w-[760px]"><TableCaption>Status is illustrative demo data, not live presence or performance tracking.</TableCaption><TableHeader><TableRow>{["Name","Role","Department","Status","Open Tasks","Actions"].map(label=><TableHead key={label}>{label}</TableHead>)}</TableRow></TableHeader><TableBody>{members.map(member=><TableRow key={member.id}><TableCell><Link href={`/team/${member.id}`} className="flex items-center gap-3 font-medium"><Avatar name={member.name} size="sm" />{member.name}</Link></TableCell><TableCell>{member.role}</TableCell><TableCell>{member.department}</TableCell><TableCell><Badge variant={member.status==="Active"?"success":"neutral"}>{member.status}</Badge></TableCell><TableCell>{count(member.id)}</TableCell><TableCell><Link href={`/team/${member.id}`}>View profile<span className="sr-only"> for {member.name}</span></Link></TableCell></TableRow>)}</TableBody></Table></div></>;
}
