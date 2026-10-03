import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { Badge } from "@/components/ui/badge";
import { integrations } from "@/data/marketing";
export function CTASection() {
  return <section className="rounded-xl border border-primary/20 bg-surface-soft px-5 py-12 text-center sm:px-10"><h2 className="dovia-section-title">Turn your next meeting into action.</h2><p className="mx-auto mt-4 max-w-xl text-text-secondary">Start with a clearer conversation. Leave with a shared plan.</p><div className="mt-6 flex flex-wrap justify-center gap-3"><ButtonLink href="/signup" variant="gradient">Get started<ArrowRight aria-hidden="true" /></ButtonLink><ButtonLink href="/login" variant="outline">Sign in</ButtonLink></div></section>;
}
export function PlannedIntegrations() {
  return <section className="space-y-6 text-center"><h2 className="dovia-section-title">Planned integrations</h2><p className="mx-auto max-w-xl text-text-secondary">Designed to fit around the tools your team uses. These connections are not available in the current preview.</p><div className="flex flex-wrap justify-center gap-3">{integrations.map(name => <Badge key={name} variant="neutral" className="px-5 py-3 text-sm">{name} · Planned</Badge>)}</div></section>;
}
