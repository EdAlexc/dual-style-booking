import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTheme } from "@/lib/theme";

const nav = [
  { to: "/work", label: "Work" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  // Close the mobile menu on route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Landing page owns the entire viewport interaction.
  if (pathname === "/") return null;

  const Wordmark = (
    <span className="font-display text-xl tracking-tight">
      Studio <span className="text-accent">MUA</span>
    </span>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Mobile: wordmark toggles the menu */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="md:hidden"
        >
          {Wordmark}
        </button>
        {/* Desktop: wordmark links home */}
        <Link to="/" className="hidden md:inline-block">
          {Wordmark}
        </Link>

        <nav className="hidden gap-8 text-sm md:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="story-link uppercase tracking-widest hover:text-foreground"
              activeProps={{ className: "!text-accent" }}
              inactiveProps={{ className: "text-muted-foreground" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            aria-label={`Switch to ${theme === "glam" ? "Bold" : "Glam"} theme`}
            className="hidden text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground sm:inline"
          >
            {theme === "glam" ? "Glam" : "Bold"} · switch
          </button>
          <Link
            to="/book"
            className="rounded-none border border-foreground bg-foreground px-4 py-2 text-xs uppercase tracking-[0.2em] text-background transition-colors hover:bg-transparent hover:text-foreground"
          >
            Book
          </Link>
        </div>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <div
          id="mobile-nav"
          className="border-t border-border/60 bg-background/95 backdrop-blur md:hidden"
        >
          <nav className="mx-auto flex max-w-7xl flex-col px-6 py-4 text-sm">
            <Link
              to="/"
              className="py-2 uppercase tracking-widest"
              activeProps={{ className: "!text-accent" }}
              inactiveProps={{ className: "text-muted-foreground" }}
            >
              Home
            </Link>
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="py-2 uppercase tracking-widest"
                activeProps={{ className: "!text-accent" }}
                inactiveProps={{ className: "text-muted-foreground" }}
              >
                {n.label}
              </Link>
            ))}
            <button
              onClick={() => {
                toggle();
                setOpen(false);
              }}
              className="mt-2 py-2 text-left text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
            >
              {theme === "glam" ? "Glam" : "Bold"} · switch
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
