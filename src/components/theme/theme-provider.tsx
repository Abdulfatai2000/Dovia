"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect, type ReactNode } from "react";
import { useTheme } from "next-themes";

const TRANSITION_MS = 240;

/**
 * Crossfades colour changes for a moment after the theme switches. The class is added and
 * removed on the document element rather than held in React state, so no render is triggered.
 */
function ThemeTransition({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme();
  useEffect(() => {
    if (!resolvedTheme) return;
    const root = document.documentElement;
    root.classList.add("theme-transition");
    const timer = setTimeout(() => root.classList.remove("theme-transition"), TRANSITION_MS);
    return () => {
      clearTimeout(timer);
      root.classList.remove("theme-transition");
    };
  }, [resolvedTheme]);
  return children;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  return <NextThemesProvider attribute="class" defaultTheme="system" enableSystem storageKey="dovia-theme">
    <ThemeTransition>{children}</ThemeTransition>
  </NextThemesProvider>;
}

export default ThemeProvider;