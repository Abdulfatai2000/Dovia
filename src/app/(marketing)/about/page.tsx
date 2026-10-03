import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { missionQuestions } from "@/data/marketing";
import { CTASection } from "@/components/marketing/marketing-sections";
export const metadata: Metadata = {title:"About Dovia",description:"Dovia's mission is to help teams leave every meeting with clear decisions, owners, deadlines, and follow-up."};
export default function Page() {
  return <div className="mx-auto max-w-6xl space-y-16 px-4 py-12 sm:px-6 lg:px-8 lg:py-20"><PageHeader eyebrow="About Dovia" title="Good conversations should lead to meaningful progress." description="Turn conversations into action." />
    <div className="grid gap-6 md:grid-cols-2"><Card className="space-y-4 p-6 sm:p-8"><h2 className="dovia-section-title">The problem</h2><p className="leading-relaxed text-text-secondary">Teams have productive meetings, but decisions, ownership, and follow-up often become scattered afterward. Notes live in one place, tasks in another, and the next meeting starts by piecing the context back together.</p></Card><Card className="space-y-4 border-primary/20 bg-surface-soft p-6 sm:p-8"><h2 className="dovia-section-title">The Dovia approach</h2><p className="leading-relaxed text-text-secondary">Dovia is being built to turn meeting conversations into structured outcomes and tracked execution. It keeps preparation, notes, reviewed decisions, action items, and follow-up connected in one workflow.</p></Card></div>
    <section className="space-y-6"><h2 className="dovia-section-title">Our mission</h2><p className="text-text-secondary">Help teams leave every meeting knowing:</p><ul className="grid gap-4 sm:grid-cols-2">{missionQuestions.map(question => <li key={question} className="flex items-center gap-3 rounded-md border border-border bg-surface p-5 font-medium"><ArrowRight aria-hidden="true" className="size-5 shrink-0 text-primary" />{question}</li>)}</ul></section>
    <section className="max-w-3xl space-y-4"><h2 className="dovia-section-title">People remain responsible for the outcome.</h2><p className="leading-relaxed text-text-secondary">AI should help teams organize a discussion, not quietly decide what everyone has committed to. Dovia puts review, clear ownership, and explicit confirmation at the center of the workflow.</p><p className="text-sm text-text-muted">Dovia is currently a frontend preview. The product&apos;s backend and AI connections will be developed in later phases.</p></section><CTASection />
  </div>;
}

