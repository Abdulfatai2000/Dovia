import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input, type InputProps } from "./input";

export interface SearchInputProps extends Omit<InputProps, "type" | "leftIcon" | "label"> { label?: string; }
export function SearchInput({ label = "Search", hideLabel = true, placeholder = "Search...", className, ...props }: SearchInputProps) {
  return <Input {...props} label={label} hideLabel={hideLabel} placeholder={placeholder} type="search" leftIcon={<Search />}
    className={cn("rounded-pill bg-surface-elevated/80 transition-shadow duration-200 focus:shadow-[0_0_0_3px_var(--blue-soft),0_8px_24px_rgb(79_107_255/14%)] [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-text-muted", className)} />;
}
