import { Button, type ButtonProps } from "./button";
import { cn } from "@/lib/utils";

export interface IconButtonProps extends Omit<ButtonProps, "aria-label" | "loadingText"> { "aria-label": string; }
export function IconButton({ className, size = "md", variant = "ghost", ...props }: IconButtonProps) {
  return <Button {...props} size={size} variant={variant} className={cn("shrink-0 p-0", size === "sm" ? "size-9" : size === "lg" ? "size-12" : "size-11", className)} />;
}
