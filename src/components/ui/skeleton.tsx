import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: ComponentPropsWithRef<"div">) {
  return <div {...props} aria-hidden="true" className={cn("dovia-shimmer rounded-default bg-border", className)} />;
}
export default Skeleton;