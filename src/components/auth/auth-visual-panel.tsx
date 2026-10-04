import Image from "next/image";
import { CalendarCheck, CircleCheckBig, FileText, Quote, Sparkles, Users } from "lucide-react";
import { Brand } from "@/components/layout/brand";
import { Badge } from "@/components/ui/badge";

const features = [
  { icon: FileText, tone: "bg-violet-soft text-violet-foreground", title: "AI Meeting Summary", description: "Convert notes or transcripts into clear summaries." },
  { icon: CircleCheckBig, tone: "bg-emerald-soft text-emerald-foreground", title: "Action Items & Owners", description: "Automatically extract and assign next steps." },
  { icon: CalendarCheck, tone: "bg-orange-soft text-orange-foreground", title: "Track Follow-ups", description: "See what is done, overdue, or still in progress." },
  { icon: Users, tone: "bg-cyan-soft text-cyan-foreground", title: "Keep Teams Aligned", description: "Turn conversations into clear, shared outcomes." },
];

export function AuthVisualPanel() {
  return (
    <aside aria-label="About Dovia"
      className="relative isolate hidden min-w-0 overflow-hidden bg-background lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col lg:overflow-y-auto">
      <Image src="/images/auth/auth-bg.png" alt="" fill fetchPriority="high" sizes="(min-width: 1024px) 58vw, 100vw"
        className="object-cover object-[80%_90%]" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-background via-background/70 to-background/0" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-background/60 to-background/0" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-tr from-ai/25 via-cyan/10 to-transparent mix-blend-soft-light" />
      <span aria-hidden="true" className="dovia-orb dovia-gradient pointer-events-none absolute -top-24 -left-24 size-[28rem] rounded-pill opacity-25 blur-3xl" />
      <span aria-hidden="true" className="dovia-orb dovia-gradient-ai pointer-events-none absolute -right-32 -bottom-32 size-[26rem] rounded-pill opacity-25 blur-3xl [animation-delay:-7s]" />

      <div className="relative flex min-h-full flex-col justify-between gap-10 p-10 xl:p-12">
        <div className="space-y-8 lg:max-w-[26rem] xl:max-w-[30rem]">
          <Brand compact href="/" label="Dovia home" sizes="48px"
            className="w-fit text-foreground hover:text-primary [&>img]:size-12" />

          <div>
            <Badge variant="info"><Sparkles aria-hidden="true" />AI-Powered Meeting Productivity</Badge>
            <p className="dovia-page-title mt-6 text-foreground">
              Turn every meeting<br />
              <span className="bg-gradient-to-r from-primary to-ai bg-clip-text text-transparent">into progress</span>
            </p>
            <p className="mt-4 max-w-md text-base leading-relaxed text-text-secondary">
              Dovia helps teams capture meeting notes, extract decisions and action items, and track
              follow-up tasks — so nothing gets forgotten.
            </p>
          </div>

          <ul className="space-y-4">
            {features.map(({ icon: Icon, tone, title, description }) => (
              <li key={title} className="flex items-start gap-3">
                <span className={`flex size-10 shrink-0 items-center justify-center rounded-md ${tone}`}>
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-text-secondary">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="dovia-glass relative rounded-lg border border-border-strong p-5 shadow-lg lg:max-w-[26rem] xl:max-w-[30rem]">
          <span aria-hidden="true" className="dovia-gradient-ai absolute -top-px -left-px size-16 rounded-tl-lg rounded-tr-full opacity-40 blur-xl" />
          <Quote aria-hidden="true" className="size-5 text-primary" />
          <p className="mt-3 text-sm font-medium text-foreground">
            Meetings should end with clear decisions, owners, and next steps.
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
            Dovia keeps follow-up connected to the conversation that created it.
          </p>
          <p className="mt-3 text-xs font-medium tracking-wide text-text-muted uppercase">
            A Dovia product principle
          </p>
        </div>
      </div>
    </aside>
  );
}
