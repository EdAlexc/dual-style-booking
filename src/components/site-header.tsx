import { Link, useRouterState } from "@tanstack/react-router";
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

  // Landing page owns the entire viewport interaction.
  if (pathname === "/") return null;

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="font-display text-xl tracking-tight">
          Studio <span className="text-accent">MUA</span>
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
    </header>
  );
}
