import Link from "next/link";
import type { CalendarEntry } from "@/lib/calendar";
import { formatTime } from "@/lib/meeting-format";
const colors={Meeting:"bg-blue-soft text-blue-foreground ring-blue/25", "Task deadline":"bg-orange-soft text-orange-foreground ring-orange/25", "Follow-up":"bg-emerald-soft text-emerald-foreground ring-emerald/25"};
export default function CalendarEvent({event,compact=false}:{event:CalendarEntry;compact?:boolean}) {
  return <Link href={event.href} className={`block rounded-default p-2 text-xs ring-1 ring-inset transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-sm hover:no-underline ${colors[event.kind]}`} title={`${event.kind}: ${event.title}`}><span className="block font-medium">{compact?<span className="block truncate">{event.title}</span>:event.title}</span><span className="mt-1 block">{event.time?formatTime(event.time):"Deadline"} · {event.kind}{event.completed?" · Completed":""}</span></Link>;
}
