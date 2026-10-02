import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends ComponentPropsWithRef<"div"> { shadow?: "none" | "sm" | "default"; }
export function Card({ className, shadow = "none", ...props }: CardProps) {
  return <div {...props} className={cn("min-w-0 rounded-lg border border-border bg-surface text-foreground", shadow === "sm" && "shadow-sm", shadow === "default" && "shadow-default", className)} />;
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
