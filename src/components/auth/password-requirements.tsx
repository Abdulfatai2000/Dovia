import { CheckCircle2, Circle } from "lucide-react";
import { passwordRules } from "./auth-validation";

export function PasswordRequirements({ password, id }: { password: string; id: string }) {
  const count = passwordRules.filter(rule => rule.test(password)).length;
  const strength = count <= 2 ? "Weak" : count < 5 ? "Fair" : "Strong";
  return <div id={id} className="space-y-3 rounded-default border border-border bg-surface-soft p-3 text-xs">
    <p className="font-medium">Password strength: {strength} · {count} of 5 requirements met</p>
    <div aria-hidden="true" className="flex gap-1">{passwordRules.map((rule, index) => <span key={rule.code} className={`h-1 flex-1 rounded-pill ${index < count ? "bg-primary" : "bg-border-strong"}`} />)}</div>
    <ul className="space-y-2">{passwordRules.map(rule => {
      const met = rule.test(password); const Icon = met ? CheckCircle2 : Circle;
      return <li key={rule.code} className={`flex items-center gap-2 ${met ? "text-success-foreground" : "text-text-secondary"}`}><Icon aria-hidden="true" className="size-4 shrink-0" /><span>{rule.label}<span className="sr-only">: {met ? "Met" : "Not met"}</span></span></li>;
    })}</ul>
  </div>;
}
