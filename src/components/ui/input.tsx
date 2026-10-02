"use client";

import { useId, type ComponentPropsWithRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { FormField, fieldDescription, type FieldProps } from "./form-field";

export interface InputProps extends ComponentPropsWithRef<"input">, FieldProps {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}
export function Input({ id, label, hideLabel, helperText, error, wrapperClassName, leftIcon, rightIcon, className, required, "aria-describedby": describedBy, ...props }: InputProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  return (
    <FormField id={fieldId} {...{ label, hideLabel, helperText, error, required, wrapperClassName }}>
      <div className="relative">
        {leftIcon && <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-text-muted [&_svg]:size-4">{leftIcon}</span>}
        <input {...props} id={fieldId} required={required} aria-invalid={error ? true : props["aria-invalid"]}
          aria-describedby={fieldDescription(fieldId, helperText, error, describedBy)}
          className={cn("dovia-control", leftIcon && "pl-10", rightIcon && "pr-10", className)} />
        {rightIcon && <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-text-muted [&_svg]:size-4">{rightIcon}</span>}
      </div>
    </FormField>
  );
}
export default Input;
