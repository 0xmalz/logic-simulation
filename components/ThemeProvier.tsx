"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * A wrapper component for managing the theme (light or dark) using the `next-themes` library.
 * This component provides the theme context to all its children and allows for theme switching.
 *
 * @param children - The child elements to be rendered inside the theme provider.
 * @param props - Additional props passed to the `NextThemesProvider` (e.g., `attribute`, `defaultTheme`).
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
