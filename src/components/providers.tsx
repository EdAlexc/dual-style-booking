"use client";

import type { ReactNode } from "react";

import { ThemeProvider } from "@/lib/theme";
import { SiteHeader } from "@/components/site-header";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <SiteHeader />
      {children}
      <Toaster />
    </ThemeProvider>
  );
}
