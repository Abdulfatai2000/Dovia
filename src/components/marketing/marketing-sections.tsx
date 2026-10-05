import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { Badge } from "@/components/ui/badge";
import { integrations } from "@/data/marketing";
export function CTASection() {
  return <section className="relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-blue/10 via-violet/8 to-pink/10 px-5 py-12 text-center sm:px-10">
    <span aria-hidden="true" className="dovia-orb dovia-gradient pointer-events-none absolute -top-24 left-1/3 size-96 rounded-pill opacity-30 blur-3xl" />
    <h2 className="dovia-section-title relative">Turn your next meeting into action.</h2>
    <p className="relative mx-auto mt-4 max-w-xl text-text-secondary">Start with a clearer conversation. Leave with a shared plan.</p>
    <div className="relative mt-6 flex flex-wrap justify-center gap-3"><ButtonLink href="/signup" variant="gradient">Get started<ArrowRight aria-hidden="true" /></ButtonLink><ButtonLink href="/login" variant="outline">Sign in</ButtonLink></div>
  </section>;
}
export function PlannedIntegrations() {
  return <section className="space-y-6 text-center"><h2 className="dovia-section-title">Planned integrations</h2><p className="mx-auto max-w-xl text-text-secondary">Designed to fit around the tools your team uses. These connections are not available in the current preview.</p><div className="flex flex-wrap justify-center gap-3">{integrations.map(name => <Badge key={name} variant="neutral" className="px-5 py-3 text-sm">{name} · Planned</Badge>)}</div></section>;
}
