"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect, useState, type ReactNode } from "react";
import { useTheme } from "next-themes";

const TRANSITION_MS = 240;

function ThemeTransition({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.classList.add("theme-transition");
    const timer = setTimeout(() => root.classList.remove("theme-transition"), TRANSITION_MS);
    return () => {
      clearTimeout(timer);
      root.classList.remove("theme-transition");
    };
  }, [resolvedTheme, mounted]);
  return children;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  return <NextThemesProvider attribute="class" defaultTheme="system" enableSystem storageKey="dovia-theme">
    <ThemeTransition>{children}</ThemeTransition>
  </NextThemesProvider>;
}

export default ThemeProvider;