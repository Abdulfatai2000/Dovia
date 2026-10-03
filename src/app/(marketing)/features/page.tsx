import type { Metadata } from "next";
import { Check } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button-link";
import { featureSections } from "@/data/marketing";
import { CTASection, PlannedIntegrations } from "@/components/marketing/marketing-sections";
export const metadata: Metadata = {title:"Dovia Features — Meeting intelligence and follow-up",description:"Explore Dovia's meeting preparation, capture, human review, ownership, and planned follow-up workflow."};
export default function Page() {
  return <div className="mx-auto max-w-7xl space-y-16 px-4 py-12 sm:px-6 lg:px-8 lg:py-20"><PageHeader eyebrow="Dovia features" title="Every conversation deserves a clear next step." description="Keep context, decisions, and execution connected from preparation to follow-up." actions={<ButtonLink href="/signup">Explore Dovia</ButtonLink>} />
    <p className="max-w-3xl text-sm leading-relaxed text-text-muted">This is a frontend preview with browser-only demo data. AI, live integrations, follow-up tracking, and reporting are planned capabilities; no backend services are connected.</p>
    <div className="grid gap-6 md:grid-cols-2">{featureSections.map(({title,description,items,icon:Icon}) => <Card key={title} className="space-y-5 p-6 sm:p-8"><span className="inline-flex rounded-md bg-ai-soft p-3 text-ai"><Icon aria-hidden="true" className="size-6" /></span><h2 className="dovia-card-title">{title}</h2><p className="text-sm leading-relaxed text-text-secondary">{description}</p><ul className="space-y-3">{items.map(item => <li key={item} className="flex items-start gap-2 text-sm"><Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />{item}</li>)}</ul></Card>)}</div>
    <PlannedIntegrations /><CTASection />
  </div>;
}
