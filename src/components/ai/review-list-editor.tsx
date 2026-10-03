"use client";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export interface ReviewTextItem { id: string; text: string; severity?: "LOW" | "MEDIUM" | "HIGH"; }
export default function ReviewListEditor({ label, items, onChange, risks = false }: {
  label: string; items: ReviewTextItem[]; onChange: (items: ReviewTextItem[]) => void; risks?: boolean;
}) {
  const update = (id: string, patch: Partial<ReviewTextItem>) => onChange(items.map(item => item.id === id ? {...item,...patch} : item));
  return <div className="space-y-4"><h2 className="dovia-section-title">{label}s</h2>
    {!items.length && <p className="text-sm text-text-muted">No {label.toLowerCase()}s. Add one if the meeting needs it.</p>}
    {items.map((item,index) => <Card key={item.id} className="space-y-3 p-4">
      <div className="flex items-start gap-3"><Textarea label={`${label} ${index+1}`} value={item.text} required wrapperClassName="flex-1" onChange={e => update(item.id,{text:e.target.value})} />
        <IconButton aria-label={`Remove ${label.toLowerCase()} ${index+1}`} onClick={() => onChange(items.filter(entry => entry.id !== item.id))}><Trash2 aria-hidden="true" /></IconButton></div>
      {risks && <div className="flex flex-wrap items-center gap-3"><Select label={`Severity for risk ${index+1}`} value={item.severity ?? "MEDIUM"} onChange={e => update(item.id,{severity:e.target.value as ReviewTextItem["severity"]})} options={[{value:"LOW",label:"Low"},{value:"MEDIUM",label:"Medium"},{value:"HIGH",label:"High"}]} /><Badge variant={item.severity === "HIGH" ? "danger" : item.severity === "LOW" ? "success" : "warning"}>{item.severity ?? "MEDIUM"} severity</Badge></div>}
    </Card>)}
    <Button variant="outline" onClick={() => onChange([...items,{id:crypto.randomUUID(),text:"",...(risks ? {severity:"MEDIUM" as const} : {})}])}><Plus aria-hidden="true" />Add {label.toLowerCase()}</Button>
  </div>;
}
