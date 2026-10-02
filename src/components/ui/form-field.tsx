import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface FieldProps {
  label: string;
  hideLabel?: boolean;
  helperText?: string;
  error?: string;
  wrapperClassName?: string;
}
export function fieldDescription(id: string, helperText?: string, error?: string, describedBy?: string) {
  return [describedBy, helperText && id + "-help", error && id + "-error"].filter(Boolean).join(" ") || undefined;
}
export function FormField({ id, label, hideLabel, helperText, error, required, wrapperClassName, children }: FieldProps & { id: string; required?: boolean; children: ReactNode }) {
  return (
    <div className={cn("min-w-0 space-y-2", wrapperClassName)}>
      <label htmlFor={id} className={cn("block text-sm font-medium text-foreground", hideLabel && "sr-only")}>
        {label}{required && <span className="ml-1 text-danger-foreground" aria-hidden="true">*</span>}
      </label>
      {children}
      {helperText && <p id={id + "-help"} className="text-sm text-text-muted">{helperText}</p>}
      {error && <p id={id + "-error"} className="text-sm text-danger-foreground">{error}</p>}
    </div>
  );
}
