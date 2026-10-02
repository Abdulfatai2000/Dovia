import { X } from "lucide-react";
import { Button, type ButtonProps } from "./button";
import { cn } from "@/lib/utils";

export interface FilterChipProps extends Omit<ButtonProps, "variant" | "size" | "aria-pressed"> { selected?: boolean; }
export function FilterChip({ selected = false, children, className, ...props }: FilterChipProps) {
  return <Button {...props} variant={selected ? "secondary" : "outline"} size="sm" aria-pressed={selected} className={cn("rounded-pill", className)}>
    {children}{selected && <X aria-hidden="true" />}
  </Button>;
}
