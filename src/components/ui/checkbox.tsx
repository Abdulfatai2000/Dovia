"use client";

import { useId, type ComponentPropsWithRef } from "react";
import { cn } from "@/lib/utils";
import { fieldDescription } from "./form-field";

export interface CheckboxProps extends Omit<ComponentPropsWithRef<"input">, "type"> {
  label: string;
  helperText?: string;
  error?: string;
}
export function Checkbox({ id, label, helperText, error, className, disabled, "aria-describedby": describedBy, ...props }: CheckboxProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  return (
    <div className={cn("min-w-0", className)}>
      <label htmlFor={fieldId} className={cn("flex min-h-11 items-center gap-3 text-sm", disabled ? "cursor-not-allowed text-text-muted" : "cursor-pointer text-foreground")}>
        <input {...props} id={fieldId} type="checkbox" disabled={disabled} aria-invalid={error ? true : props["aria-invalid"]}
          aria-describedby={fieldDescription(fieldId, helperText, error, describedBy)} className="size-4 shrink-0 accent-primary" />
        <span>{label}{props.required && <span aria-hidden="true" className="ml-1 text-danger-foreground">*</span>}</span>
      </label>
      {helperText && <p id={fieldId + "-help"} className="ml-7 text-sm text-text-muted">{helperText}</p>}
      {error && <p id={fieldId + "-error"} className="ml-7 text-sm text-danger-foreground">{error}</p>}
    </div>
  );
}
export default Checkbox;
