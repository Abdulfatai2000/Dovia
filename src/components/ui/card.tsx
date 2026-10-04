import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends ComponentPropsWithRef<"div"> {
  shadow?: "none" | "sm" | "default" | "lg";
  /** Adds the shared hover lift. Reserve for cards that are, or lead to, something clickable. */
  interactive?: boolean;
  /** `glass` is reserved for chrome and floating overlays; `accent` tints with the section accent. */
  tone?: "default" | "glass" | "accent" | "ai";
}
const shadows: Record<NonNullable<CardProps["shadow"]>, string> = {
  none: "",
  sm: "shadow-sm",
  default: "shadow-default",
  lg: "shadow-lg",
};
export function Card({ className, shadow = "none", interactive = false, tone = "default", ...props }: CardProps) {
  return <div {...props} className={cn(
    "min-w-0 rounded-lg border border-border bg-surface text-foreground",
    shadows[shadow],
    interactive && "dovia-lift cursor-pointer",
    tone === "glass" && "dovia-glass border-border-strong",
    tone === "accent" && "dovia-accent-border dovia-accent-tint",
    tone === "ai" && "border-ai/25 bg-ai-soft/60 shadow-glow-ai",
    className)} />;
}
export function CardHeader({ className, ...props }: ComponentPropsWithRef<"div">) {
  return <div {...props} className={cn("space-y-2 p-[var(--card-padding)]", className)} />;
}
export function CardTitle({ className, ...props }: ComponentPropsWithRef<"h3">) {
  return <h3 {...props} className={cn("dovia-card-title break-words", className)} />;
}
export function CardDescription({ className, ...props }: ComponentPropsWithRef<"p">) {
  return <p {...props} className={cn("text-sm leading-relaxed text-text-secondary", className)} />;
}
export function CardContent({ className, ...props }: ComponentPropsWithRef<"div">) {
  return <div {...props} className={cn("p-[var(--card-padding)] pt-0", className)} />;
}
export function CardFooter({ className, ...props }: ComponentPropsWithRef<"div">) {
  return <div {...props} className={cn("flex flex-wrap items-center gap-3 border-t border-border p-[var(--card-padding)]", className)} />;
}
export default Card;