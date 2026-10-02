"use client";

import { useId, useState, type ComponentPropsWithRef } from "react";
import { cn } from "@/lib/utils";
import { FormField, fieldDescription, type FieldProps } from "./form-field";

export interface TextareaProps extends ComponentPropsWithRef<"textarea">, FieldProps { showCount?: boolean; }
export function Textarea({ id, label, hideLabel, helperText, error, wrapperClassName, className, required, showCount = false, value, defaultValue, onChange, maxLength, "aria-describedby": describedBy, ...props }: TextareaProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const [length, setLength] = useState(String(defaultValue ?? "").length);
  const count = value !== undefined ? String(value).length : length;
  return (
    <FormField id={fieldId} {...{ label, hideLabel, helperText, error, required, wrapperClassName }}>
      <textarea {...props} id={fieldId} required={required} value={value} defaultValue={defaultValue} maxLength={maxLength}
        onChange={(event) => { setLength(event.target.value.length); onChange?.(event); }}
        aria-invalid={error ? true : props["aria-invalid"]}
        aria-describedby={fieldDescription(fieldId, helperText, error, [describedBy, showCount && fieldId + "-count"].filter(Boolean).join(" "))}
        className={cn("dovia-control block min-h-32 resize-y", className)} />
      {showCount && <p id={fieldId + "-count"} className="text-right text-xs text-text-muted">{count}{maxLength !== undefined && " / " + maxLength} characters</p>}
    </FormField>
  );
}
export default Textarea;
