import type { Metadata } from "next";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button-link";
import { Progress } from "@/components/ui/progress";
import HeroProductPreview from "@/components/marketing/hero-product-preview";
import { CTASection, PlannedIntegrations } from "@/components/marketing/marketing-sections";
import { coreValues, workflowSteps, useCases, outcomeFlow, followUpMetrics, previewActivity } from "@/data/marketing";
export const metadata: Metadata = { title:"Dovia — Turn conversations into action", description:"Bring meeting notes, reviewed decisions, clear owners, and follow-up work into one workspace." };
export default function Page() {
  return <div className="mx-auto max-w-7xl space-y-20 px-4 py-12 sm:px-6 sm:py-16 lg:space-y-24 lg:px-8">
    <section className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14"><div className="space-y-6"><Badge variant="ai"><Sparkles aria-hidden="true" />AI-Powered Meeting Productivity</Badge>
      <h1 className="dovia-display">Turn every meeting<br /><span className="text-primary">into progress.</span></h1>
      <p className="max-w-xl text-lg leading-relaxed text-text-secondary">Dovia helps teams capture meeting notes, organize decisions and action items, assign ownership, and track follow-up work so important commitments do not disappear after the meeting.</p>
      <div className="flex flex-wrap gap-3"><ButtonLink href="/signup" variant="gradient" size="lg">Get started free<ArrowRight aria-hidden="true" /></ButtonLink><ButtonLink href="#how-it-works" variant="outline" size="lg">See how Dovia works</ButtonLink></div>
      <p className="text-sm text-text-muted">Explore the frontend preview. Plans and availability will be announced before launch.</p>
    </div><HeroProductPreview /></section>
    <section className="space-y-8"><div className="max-w-2xl space-y-3"><p className="text-sm font-medium text-primary">Clarity from conversation to commitment</p><h2 className="dovia-section-title">One place for the meeting and what comes next.</h2></div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{coreValues.map(({title,description,icon:Icon}) => <Card key={title} className="space-y-4 p-5"><span className="inline-flex rounded-md bg-ai-soft p-3 text-ai"><Icon aria-hidden="true" className="size-5" /></span><h3 className="dovia-card-title">{title}</h3><p className="text-sm leading-relaxed text-text-secondary">{description}</p></Card>)}</div>
    </section>
    <section id="how-it-works" className="scroll-mt-28 space-y-8"><div className="space-y-3"><h2 className="dovia-section-title">How Dovia works</h2><p className="max-w-2xl text-text-secondary">A considered path from the first agenda item to the next follow-up. AI and execution features are being built around this workflow.</p></div><ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{workflowSteps.map((step,index) => <li key={step.title} className="space-y-3 rounded-lg border border-border bg-surface p-5"><span className="inline-flex size-9 items-center justify-center rounded-pill bg-primary text-sm font-semibold text-on-brand">{index+1}</span><h3 className="text-base font-semibold">{step.title}</h3><p className="text-sm leading-relaxed text-text-secondary">{step.description}</p></li>)}</ol></section>
    <section className="space-y-8 rounded-xl bg-sidebar px-5 py-12 text-sidebar-text sm:px-10"><div className="max-w-2xl space-y-4"><h2 className="dovia-section-title text-on-brand">Meetings should end with more than notes.</h2><p className="leading-relaxed">A useful record makes the decision visible, gives the action an owner, and keeps progress connected to the original conversation.</p></div><ol className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">{outcomeFlow.map((step,index) => <li key={step} className="flex items-center gap-3"><span className="rounded-default border border-sidebar-hover bg-sidebar-secondary px-4 py-3 text-sm">{step}</span>{index < outcomeFlow.length-1 && <ArrowRight aria-hidden="true" className="size-4 rotate-90 sm:rotate-0" />}</li>)}</ol></section>
    <section id="use-cases" className="scroll-mt-28 space-y-8"><h2 className="dovia-section-title">Built around the conversations teams have.</h2><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{useCases.map(item => <Card key={item.title} className="space-y-3 p-6"><h3 className="dovia-card-title">{item.title}</h3><p className="text-sm leading-relaxed text-text-secondary">{item.description}</p></Card>)}</div></section>
    <section className="grid items-center gap-8 lg:grid-cols-2"><div className="space-y-5"><h2 className="dovia-section-title">The meeting ends.<br />The work doesn&apos;t.</h2><p className="max-w-lg leading-relaxed text-text-secondary">Follow-up is part of the meeting, not an afterthought. Dovia is designed to keep unfinished commitments in view and bring them into the next conversation.</p><Badge variant="neutral">Illustrative follow-up UI · Planned workflow</Badge></div>
      <Card className="space-y-6 p-5 sm:p-7"><div className="grid grid-cols-2 gap-4 sm:grid-cols-4">{followUpMetrics.map(metric => <div key={metric.label}><p className="text-2xl font-semibold">{metric.value}</p><p className="text-xs text-text-muted">{metric.label}</p></div>)}</div><Progress value={5} max={8} label="Sample task completion" /><ul className="space-y-3">{previewActivity.map(activity => <li key={activity} className="flex items-start gap-2 text-sm text-text-secondary"><CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />{activity}</li>)}</ul><p className="text-xs text-text-muted">Sample data only, not customer or productivity claims.</p></Card>
    </section>
    <PlannedIntegrations /><CTASection />
  </div>;
}
