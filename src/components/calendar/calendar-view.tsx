"use client";
import Link from "next/link";
import { useState } from "react";
import { ChevronLeft,ChevronRight,Plus } from "lucide-react";
import { useMeetings } from "@/hooks/use-meetings";
import { useTasks } from "@/hooks/use-tasks";
import { DEMO_TODAY } from "@/data/mock/meetings";
import { dateKey,shiftDay,weekStart,inDemoWeek,taskHref } from "@/lib/task-utils";
import { calendarEntries,type CalendarEntry } from "@/lib/calendar";
import { formatDate,formatTime } from "@/lib/meeting-format";
import { PageHeader } from "@/components/ui/page-header";
import { SectionHeader } from "@/components/ui/section-header";
import { ButtonLink } from "@/components/ui/button-link";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Tabs } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import CalendarEvent from "./calendar-event";
const weekdays=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
function DayAgenda({day,entries}:{day:string;entries:CalendarEntry[]}) {
  const items=entries.filter(event=>event.date===day);
  return <section className="space-y-3"><h3 className="text-sm font-semibold">{formatDate(day)}</h3>{items.length?<ul className="space-y-2">{items.map(event=><li key={event.id}><CalendarEvent event={event} /></li>)}</ul>:<p className="rounded-md bg-surface-soft p-4 text-sm text-text-muted">No events today.</p>}</section>;
}
export default function CalendarView() {
  const meetings=useMeetings();const tasks=useTasks();const [view,setView]=useState("Month");const [day,setDay]=useState(DEMO_TODAY);
  if(meetings.loading||tasks.loading)return <LoadingState label="Loading calendar…" />;
  if(meetings.error||tasks.error)return <div className="space-y-6"><PageHeader title="Calendar" /><ErrorState description={meetings.error||tasks.error} /></div>;
  const entries=calendarEntries(meetings.meetings,tasks.tasks);
  const anchor=new Date(day+"T12:00:00Z");const first=dateKey(new Date(Date.UTC(anchor.getUTCFullYear(),anchor.getUTCMonth(),1,12)));
  const days=Array.from({length:42},(_,index)=>shiftDay(weekStart(first),index));
  const week=Array.from({length:7},(_,index)=>shiftDay(weekStart(day),index));
  const title=view==="Month"?new Intl.DateTimeFormat("en-US",{month:"long",year:"numeric",timeZone:"UTC"}).format(anchor):view==="Week"?`${formatDate(week[0])} – ${formatDate(week[6])}`:formatDate(day);
  function move(direction:number){if(view==="Month")setDay(dateKey(new Date(Date.UTC(anchor.getUTCFullYear(),anchor.getUTCMonth()+direction,1,12))));else setDay(shiftDay(day,direction*(view==="Week"?7:1)));}
  const month=<div className="space-y-6"><div className="overflow-hidden rounded-md border border-border"><div className="grid grid-cols-7 bg-surface-soft">{weekdays.map(label=><div key={label} className="py-3 text-center text-xs font-medium">{label}</div>)}</div><div className="grid grid-cols-7">{days.map(date=>{
    const events=entries.filter(event=>event.date===date);const currentMonth=date.slice(0,7)===day.slice(0,7);
    return <div key={date} className={`min-w-0 border-t border-r border-border p-1 md:min-h-32 ${currentMonth?"bg-surface":"bg-surface-soft"}`}><button type="button" aria-label={`${formatDate(date)}, ${events.length} items`} aria-pressed={date===day} aria-current={date===DEMO_TODAY?"date":undefined} onClick={()=>setDay(date)} className={`flex min-h-11 w-full flex-col items-center justify-center rounded-default text-xs md:min-h-8 md:items-start md:px-2 ${date===day?"bg-primary text-on-brand":"text-text-secondary hover:bg-surface-hover"}`}><span>{Number(date.slice(-2))}</span>{events.length>0&&<span className="text-[10px] md:hidden">{events.length} items</span>}</button><div className="hidden space-y-1 pt-1 md:block">{events.slice(0,2).map(event=><CalendarEvent key={event.id} event={event} compact />)}{events.length>2&&<button type="button" className="min-h-8 w-full rounded-sm text-xs text-primary" onClick={()=>{setDay(date);setView("Day");}}>+{events.length-2} more</button>}</div></div>;
  })}</div></div><div className="md:hidden"><DayAgenda day={day} entries={entries} /></div></div>;
  const content=view==="Month"?month:view==="Week"?<div className="grid gap-5 sm:grid-cols-2">{week.map(date=><DayAgenda key={date} day={date} entries={entries} />)}</div>:<DayAgenda day={day} entries={entries} />;
  const upcoming=meetings.meetings.filter(m=>m.date>=DEMO_TODAY&&["SCHEDULED","IN_PROGRESS"].includes(m.status)).sort((a,b)=>(a.date+(a.startTime??"")).localeCompare(b.date+(b.startTime??""))).slice(0,4);
  const reminders=tasks.tasks.filter(t=>t.status!=="COMPLETED").sort((a,b)=>(a.dueDate??"9999").localeCompare(b.dueDate??"9999")).slice(0,4);
  return <div className="space-y-6"><PageHeader title="Calendar" description="View meetings, deadlines, and follow-up work in one place." actions={<ButtonLink href="/meetings/new"><Plus aria-hidden="true" />New Meeting</ButtonLink>} /><p className="text-xs text-text-muted">Demo calendar · Today is {formatDate(DEMO_TODAY)}. No external calendars or reminders are connected.</p>
    <div className="grid gap-4 sm:grid-cols-3">{[{label:"Today",value:entries.filter(e=>e.date===DEMO_TODAY).length},{label:"This Week",value:entries.filter(e=>inDemoWeek(e.date)).length},{label:"Pending Follow-ups",value:tasks.tasks.filter(t=>t.meetingId&&t.status!=="COMPLETED").length}].map(item=><Card key={item.label} className="p-5"><p className="text-sm text-text-secondary">{item.label}</p><p className="mt-2 text-3xl font-semibold">{item.value}</p></Card>)}</div>
    <div className="grid items-start gap-6 2xl:grid-cols-[minmax(0,1fr)_18rem]"><Card className="space-y-5 p-3 sm:p-5"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="dovia-card-title" aria-live="polite">{title}</h2><div className="flex items-center gap-2"><IconButton aria-label={`Previous ${view.toLowerCase()}`} onClick={()=>move(-1)}><ChevronLeft aria-hidden="true" /></IconButton><Button variant="outline" size="sm" onClick={()=>setDay(DEMO_TODAY)}>Today</Button><IconButton aria-label={`Next ${view.toLowerCase()}`} onClick={()=>move(1)}><ChevronRight aria-hidden="true" /></IconButton></div></div><ul aria-label="Calendar legend" className="flex flex-wrap gap-3 text-xs"><li className="rounded-sm bg-info-soft px-2 py-1 text-info-foreground">Meeting</li><li className="rounded-sm bg-ai-soft px-2 py-1 text-ai">Task deadline</li><li className="rounded-sm bg-warning-soft px-2 py-1 text-warning-foreground">Follow-up · linked open task</li></ul><Tabs label="Calendar view" value={view} onValueChange={setView} items={["Month","Week","Day"].map(value=>({value,label:value,content:view===value?content:null}))} /></Card>
    <aside className="min-w-0 space-y-5"><Card className="space-y-4 p-5"><SectionHeader title="Upcoming Meetings" />{upcoming.length?<ul className="space-y-4">{upcoming.map(m=><li key={m.id}><Link href={`/meetings/${m.id}`} className="text-sm font-medium">{m.title}</Link><p className="mt-1 text-xs text-text-muted">{formatDate(m.date)} · {formatTime(m.startTime)}</p></li>)}</ul>:<p className="text-sm text-text-muted">No upcoming meetings.</p>}</Card><Card className="space-y-4 p-5"><SectionHeader title="Reminders" description="A visual list of open commitments. No alerts are sent." />{reminders.length?<ul className="space-y-4">{reminders.map(t=><li key={t.id}><Link href={taskHref(t.id)} className="text-sm">{t.title}</Link><p className="mt-1 text-xs text-text-muted">{t.dueDate?formatDate(t.dueDate):"No deadline"}</p></li>)}</ul>:<EmptyState title="All caught up" description="No open tasks to remind you about." />}</Card></aside></div>
  </div>;
}
