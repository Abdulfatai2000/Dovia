"use client";

import { useId, type ComponentPropsWithRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormField, fieldDescription, type FieldProps } from "./form-field";

export interface SelectOption { value: string; label: string; disabled?: boolean; }
export interface SelectProps extends Omit<ComponentPropsWithRef<"select">, "children" | "multiple" | "size">, FieldProps {
  options: readonly SelectOption[];
  placeholder?: string;
}
export function Select({ id, label, hideLabel, helperText, error, wrapperClassName, options, placeholder, className, required, value, defaultValue, "aria-describedby": describedBy, ...props }: SelectProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  return (
    <FormField id={fieldId} {...{ label, hideLabel, helperText, error, required, wrapperClassName }}>
      <div className="relative">
        <select {...props} id={fieldId} required={required} value={value} defaultValue={value === undefined ? (defaultValue ?? (placeholder ? "" : undefined)) : undefined}
          aria-invalid={error ? true : props["aria-invalid"]} aria-describedby={fieldDescription(fieldId, helperText, error, describedBy)}
          className={cn("dovia-control appearance-none pr-10", className)}>
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map(option => <option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>)}
        </select>
        <ChevronDown aria-hidden="true" className="pointer-events-none absolute top-3.5 right-3 size-4 text-text-muted" />
      </div>
    </FormField>
  );
}
export default Select;
