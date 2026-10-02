import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/utils";

export interface TableProps extends ComponentPropsWithRef<"table"> {
  /** Names the keyboard-scrollable region; also provide a TableCaption or table aria-label. */
  containerLabel: string;
  containerClassName?: string;
}
export function Table({ containerLabel, containerClassName, className, ...props }: TableProps) {
  return <div role="region" aria-label={containerLabel} tabIndex={0} className={cn("max-w-full min-w-0 overflow-x-auto rounded-md border border-border", containerClassName)}>
    <table {...props} className={cn("w-full border-collapse text-left text-sm", className)} />
  </div>;
}
export function TableHeader({ className, ...props }: ComponentPropsWithRef<"thead">) {
  return <thead {...props} className={cn("bg-surface-soft text-text-secondary", className)} />;
}
export function TableBody({ className, ...props }: ComponentPropsWithRef<"tbody">) {
  return <tbody {...props} className={cn("divide-y divide-border bg-surface", className)} />;
}
export function TableFooter({ className, ...props }: ComponentPropsWithRef<"tfoot">) {
  return <tfoot {...props} className={cn("border-t border-border bg-surface-soft font-medium", className)} />;
}
export function TableRow({ className, ...props }: ComponentPropsWithRef<"tr">) {
  return <tr {...props} className={cn("transition-colors duration-200 hover:bg-surface-hover", className)} />;
}
export function TableHead({ className, scope = "col", ...props }: ComponentPropsWithRef<"th">) {
  return <th {...props} scope={scope} className={cn("px-4 py-3 text-xs font-medium whitespace-nowrap", className)} />;
}
export function TableCell({ className, ...props }: ComponentPropsWithRef<"td">) {
  return <td {...props} className={cn("px-4 py-4 align-middle text-text-secondary", className)} />;
}
export function TableCaption({ className, ...props }: ComponentPropsWithRef<"caption">) {
  return <caption {...props} className={cn("caption-bottom p-3 text-left text-sm text-text-muted", className)} />;
}
export default Table;
