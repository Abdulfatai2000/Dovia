import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { buttonStyles, type ButtonVariant, type ButtonSize } from "./button";

export function ButtonLink({ variant = "primary", size = "md", className, ...props }:
  ComponentProps<typeof Link> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return <Link {...props} className={cn(buttonStyles(variant, size), "hover:no-underline", className)} />;
}
