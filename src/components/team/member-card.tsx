import Link from "next/link";
import type { DemoUser } from "@/data/mock/users";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
export default function MemberCard({member,openTasks}:{member:DemoUser;openTasks:number}) {
  return <Card className="space-y-4 p-5"><div className="flex items-center gap-3"><Avatar name={member.name} /><div className="min-w-0"><h3 className="font-semibold"><Link href={`/team/${member.id}`}>{member.name}</Link></h3><p className="text-sm text-text-secondary">{member.role}</p></div></div><p className="text-sm text-text-muted">{member.department}</p><div className="flex flex-wrap items-center justify-between gap-3"><Badge variant={member.status==="Active"?"success":"neutral"}>{member.status}</Badge><span className="text-sm">{openTasks} open tasks</span></div></Card>;
}
