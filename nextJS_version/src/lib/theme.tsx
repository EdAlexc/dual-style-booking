"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Theme = "glam" | "bold";

type ThemeCtx = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
};

const Ctx = createContext<ThemeCtx | null>(null);

const STORAGE_KEY = "mua-theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  // The inline script in app/layout.tsx applies the persisted theme to
  // <html data-theme> before first paint, so colors never flash. React
  // state starts from that attribute, but consumers see "glam" until
  // after hydration so the first client render matches the server HTML
  // (theme-dependent hrefs/labels would otherwise be a hydration error).
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof document !== "undefined") {
      const t = document.documentElement.getAttribute("data-theme");
      if (t === "glam" || t === "bold") return t;
    }
    return "glam";
  });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {}
  }, [theme]);

  const setTheme = (t: Theme) => setThemeState(t);
  const toggle = () => setThemeState((t) => (t === "glam" ? "bold" : "glam"));

  return (
    <Ctx.Provider value={{ theme: hydrated ? theme : "glam", setTheme, toggle }}>
      {children}
    </Ctx.Provider>
  );
}

export function useTheme() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useTheme must be used inside ThemeProvider");
  return v;
}
