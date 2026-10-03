import type { AgendaItem } from "@/types/meeting";
import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";
export default function MeetingAgenda({ agenda }: { agenda: AgendaItem[] }) {
  return <Card className="space-y-5 p-5"><SectionHeader title="Upcoming Agenda" description={`${agenda.length} items to guide the conversation`} />
    {agenda.length ? <ol className="space-y-4">{agenda.map((item,index) => <li key={item.id} className="flex gap-3">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-pill bg-surface-soft text-xs font-medium text-primary">{index+1}</span>
      <div className="min-w-0"><p className="break-words text-sm font-medium">{item.title}</p>{item.time && <p className="mt-1 text-xs text-text-muted">{item.time}</p>}</div>
    </li>)}</ol> : <p className="text-sm text-text-muted">No agenda items have been added.</p>}
  </Card>;
}
