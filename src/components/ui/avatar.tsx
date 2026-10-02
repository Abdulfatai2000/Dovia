"use client";

import { useState, type ComponentPropsWithRef } from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps extends Omit<ComponentPropsWithRef<"span">, "children"> {
  name: string;
  src?: string;
  alt?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}
const sizes = { xs: "size-6 text-[10px]", sm: "size-8 text-xs", md: "size-10 text-sm", lg: "size-12 text-base", xl: "size-16 text-xl" };
export function Avatar({ name, src, alt, size = "md", className, ...props }: AvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string>();
  const words = name.trim().split(/\s+/).filter(Boolean);
  const initials = (words.length > 1 ? words[0][0] + words[words.length - 1][0] : Array.from(words[0] ?? "?").slice(0, 2).join("")).toLocaleUpperCase();
  const imageVisible = Boolean(src && src !== failedSrc);
  const accessibleName = alt ?? (name.trim() || "Unknown person");
  return (
    <span {...props} role={imageVisible ? undefined : "img"} aria-label={imageVisible ? undefined : accessibleName}
      className={cn("inline-flex shrink-0 items-center justify-center overflow-hidden rounded-pill border border-border bg-ai-soft font-medium text-ai", sizes[size], className)}>
      {imageVisible ? (
        // Remote user avatars are intentionally native images; no image-host allowlist is required.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={accessibleName} className="size-full object-cover" onError={() => setFailedSrc(src)} />
      ) : <span aria-hidden="true">{initials}</span>}
    </span>
  );
}
export default Avatar;
