"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

// next-themes intentionally injects a <script> tag to set the theme before
// React hydrates (prevents flash of wrong theme). React warns about this but
// it's harmless — suppress the noise at module init before any rendering.
if (typeof console !== "undefined") {
  const orig = console.error;
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("script tag while rendering React component")
    ) {
      return;
    }
    orig.call(console, ...args);
  };
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
