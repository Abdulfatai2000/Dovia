import { Search } from "lucide-react";
import { Input, type InputProps } from "./input";

export interface SearchInputProps extends Omit<InputProps, "type" | "leftIcon" | "label"> { label?: string; }
export function SearchInput({ label = "Search", hideLabel = true, placeholder = "Search...", ...props }: SearchInputProps) {
  return <Input {...props} label={label} hideLabel={hideLabel} placeholder={placeholder} type="search" leftIcon={<Search />} />;
}
