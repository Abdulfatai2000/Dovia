import { FileText } from "lucide-react";
import type { MeetingFile } from "@/types/meeting";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
export default function MeetingFiles({ files }: { files: MeetingFile[] }) {
  return <Card className="space-y-5 p-5"><SectionHeader title="Supporting Files" description="Demo references only. External files are not connected." />
    {files.length ? <ul className="space-y-4">{files.map(file => <li key={file.id} className="flex items-start gap-3"><span className="rounded-default bg-surface-soft p-2 text-primary"><FileText aria-hidden="true" className="size-5" /></span><div className="min-w-0"><p className="break-words text-sm font-medium">{file.name}</p><p className="text-xs text-text-muted">{file.type} · Reference preview</p></div></li>)}</ul> : <p className="text-sm text-text-muted">No supporting files have been added.</p>}
  </Card>;
}
