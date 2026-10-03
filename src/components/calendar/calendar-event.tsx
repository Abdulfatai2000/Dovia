import Link from "next/link";
import type { CalendarEntry } from "@/lib/calendar";
import { formatTime } from "@/lib/meeting-format";
const colors={Meeting:"bg-info-soft text-info-foreground", "Task deadline":"bg-ai-soft text-ai", "Follow-up":"bg-warning-soft text-warning-foreground"};
export default function CalendarEvent({event,compact=false}:{event:CalendarEntry;compact?:boolean}) {
  return <Link href={event.href} className={`block rounded-default p-2 text-xs hover:no-underline ${colors[event.kind]}`} title={`${event.kind}: ${event.title}`}><span className="block font-medium">{compact?<span className="block truncate">{event.title}</span>:event.title}</span><span className="mt-1 block">{event.time?formatTime(event.time):"Due today"} · {event.kind}{event.completed?" · Completed":""}</span></Link>;
}
