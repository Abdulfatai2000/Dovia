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
  primary: "bg-primary text-on-brand hover:bg-primary-hover active:bg-primary-active",
  secondary: "bg-ai-soft text-secondary hover:bg-surface-hover active:bg-border",
  outline: "border-control-border bg-surface text-text-secondary hover:bg-surface-hover active:bg-surface-soft",
  ghost: "text-text-secondary hover:bg-surface-hover active:bg-surface-soft",
  danger: "bg-danger-foreground text-on-brand hover:bg-danger-hover active:bg-danger-hover",
  success: "bg-success-foreground text-on-brand hover:bg-success-hover active:bg-success-hover",
  gradient: "dovia-gradient text-on-brand hover:brightness-95 active:brightness-90",
};
const sizes: Record<ButtonSize, string> = {
  sm: "min-h-9 px-3 py-1.5 text-sm",
  md: "min-h-11 px-4 py-2.5 text-sm",
  lg: "min-h-12 px-5 py-3 text-base",
};
export function Button({ variant = "primary", size = "md", loading = false, loadingText, disabled, className, children, type = "button", ...props }: ButtonProps) {
  return (
    <button {...props} type={type} disabled={disabled || loading} aria-busy={loading || undefined}
      className={cn("inline-flex max-w-full shrink-0 items-center justify-center gap-2 rounded-default border border-transparent font-medium whitespace-normal transition-[color,background-color,filter] duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0", variants[variant], sizes[size], className)}>
      {loading && <LoaderCircle aria-hidden="true" className="dovia-spinner" />}
      {loading && loadingText ? loadingText : children}
      {loading && !loadingText && <span className="sr-only"> — Loading</span>}
    </button>
  );
}
export default Button;
