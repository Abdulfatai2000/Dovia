import type { ComponentPropsWithRef } from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "success" | "gradient";
export type ButtonSize = "sm" | "md" | "lg";
export interface ButtonProps extends ComponentPropsWithRef<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  loadingText?: string;
}
const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-on-brand shadow-sm hover:-translate-y-px hover:bg-primary-hover hover:shadow-glow active:translate-y-0 active:scale-[0.98] active:bg-primary-active",
  secondary: "bg-ai-soft text-secondary hover:-translate-y-px hover:bg-surface-hover active:scale-[0.98]",
  outline: "border-control-border bg-surface-elevated text-text-secondary hover:-translate-y-px hover:border-primary hover:text-foreground hover:shadow-sm active:scale-[0.98] active:bg-surface-soft",
  ghost: "text-text-secondary hover:bg-surface-hover active:scale-[0.98] active:bg-surface-soft",
  danger: "bg-danger-foreground text-on-brand shadow-sm hover:-translate-y-px hover:bg-danger-hover hover:shadow-glow active:translate-y-0 active:scale-[0.98]",
  success: "bg-success-foreground text-on-brand shadow-sm hover:-translate-y-px hover:bg-success-hover hover:shadow-glow active:translate-y-0 active:scale-[0.98]",
  gradient: "dovia-gradient dovia-sheen text-on-brand shadow-default hover:-translate-y-px hover:brightness-[1.06] hover:shadow-glow active:translate-y-0 active:scale-[0.98]",
};
const sizes: Record<ButtonSize, string> = {
  sm: "min-h-9 px-3 py-1.5 text-sm",
  md: "min-h-11 px-4 py-2.5 text-sm",
  lg: "min-h-12 px-5 py-3 text-base",
};
export function buttonStyles(variant: ButtonVariant = "primary", size: ButtonSize = "md") {
  return cn("inline-flex max-w-full shrink-0 items-center justify-center gap-2 rounded-default border border-transparent font-medium whitespace-normal transition-[color,background-color,box-shadow,transform,filter] duration-200 ease-out disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none disabled:hover:translate-y-0 [&_svg]:size-4 [&_svg]:shrink-0", variants[variant], sizes[size]);
}
export function Button({ variant = "primary", size = "md", loading = false, loadingText, disabled, className, children, type = "button", ...props }: ButtonProps) {
  return (
    <button {...props} type={type} disabled={disabled || loading} aria-busy={loading || undefined}
      className={cn(buttonStyles(variant, size), className)}>
      {loading && <LoaderCircle aria-hidden="true" className="dovia-spinner" />}
      {loading && loadingText ? loadingText : children}
      {loading && !loadingText && <span className="sr-only"> — Loading</span>}
    </button>
  );
}
export default Button;