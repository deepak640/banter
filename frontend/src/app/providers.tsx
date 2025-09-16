"use client";

import { ThemeProvider } from "next-themes";
import Provider from "./_components/provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Provider>{children}</Provider>
    </ThemeProvider>
  );
}
