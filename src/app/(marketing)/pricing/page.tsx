import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { pricingPlans } from "@/data/marketing";
export const metadata: Metadata = {title:"Dovia Pricing",description:"Dovia pricing will be announced before public launch. Explore the planned Starter, Team, and Organization options."};
export default function Page() {
  return <div className="mx-auto max-w-7xl space-y-12 px-4 py-12 sm:px-6 lg:px-8 lg:py-20"><PageHeader eyebrow="Pricing" title="A clearer plan for meeting follow-through." description="Pricing announced before public launch. Explore the intended plan options while we build Dovia." />
    <div className="grid gap-6 md:grid-cols-3">{pricingPlans.map(plan => <Card key={plan.name} className="flex flex-col items-start gap-6 p-6 sm:p-8"><Badge variant="neutral">Coming soon</Badge><h2 className="dovia-section-title">{plan.name}</h2><p className="flex-1 text-sm leading-relaxed text-text-secondary">{plan.description}</p><p className="text-sm font-medium">Pricing announced before public launch.</p><ButtonLink href="/signup" className="w-full">Join early access</ButtonLink></Card>)}</div>
    <Card className="space-y-3 p-6"><h2 className="dovia-card-title">No subscriptions are available yet.</h2><p className="max-w-3xl text-sm leading-relaxed text-text-secondary">Plan features, limits, availability, and prices are still being defined. Early-access buttons open the signup preview; account creation and early-access registration are not connected yet. No payment is collected.</p></Card>
  </div>;
}
