import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/utils";

export function Divider({ className, ...props }: ComponentPropsWithRef<"hr">) {
  return <hr {...props} className={cn("w-full border-0 border-t border-border", className)} />;
}
