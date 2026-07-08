import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import { WORK } from "@/lib/site-data";
import { useTheme } from "@/lib/theme";

const workSearchSchema = z.object({
  filter: fallback(z.enum(["all", "glam", "bold"]), "all").default("all"),
});

export const Route = createFileRoute("/work")({
  validateSearch: zodValidator(workSearchSchema),
  head: () => ({
    meta: [
      { title: "Work — Studio MUA" },
      { name: "description", content: "Selected editorial, campaign, and bridal makeup by Studio MUA." },
      { property: "og:title", content: "Work — Studio MUA" },
      { property: "og:description", content: "Selected editorial, campaign, and bridal makeup." },
    ],
  }),
  component: WorkPage,
});

type Filter = "all" | "glam" | "bold";

function WorkPage() {
  const { filter: initialFilter } = Route.useSearch();
  const [filter, setFilter] = useState<Filter>(initialFilter);
  const { theme } = useTheme();

  // Keep local filter in sync when arriving via a new search param.
  useEffect(() => {
    setFilter(initialFilter);
  }, [initialFilter]);

  const items = useMemo(
    () => (filter === "all" ? WORK : WORK.filter((w) => w.theme === filter)),
    [filter],
  );

  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-7xl px-6 pb-8 pt-16">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          {theme === "glam" ? "Glam register" : "Bold register"} · selected work
        </p>
        <h1 className="mt-3 font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.95]">
          Faces, in two registers.
        </h1>
        <div className="mt-8 flex gap-6 text-xs uppercase tracking-[0.3em]">
          {(["all", "glam", "bold"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`story-link ${filter === f ? "text-foreground" : "text-muted-foreground"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-x-6 gap-y-16 px-6 pb-24 md:grid-cols-2 lg:grid-cols-3">
        {items.map((w, i) => (
          <article key={w.slug} className="group animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
            <div
              className="relative aspect-[3/4] overflow-hidden bg-muted"
              style={{
                background:
                  w.theme === "bold"
                    ? "linear-gradient(135deg, oklch(0.18 0.02 20), oklch(0.32 0.14 25))"
                    : "linear-gradient(135deg, oklch(0.95 0.02 60), oklch(0.82 0.08 30))",
              }}
            >
              <div className="absolute inset-0 flex items-end p-6">
                <span className="font-display text-4xl text-background mix-blend-difference">
                  {w.title}
                </span>
              </div>
              <span className="absolute right-4 top-4 border border-background/40 px-2 py-1 text-[9px] uppercase tracking-[0.3em] text-background mix-blend-difference">
                {w.theme}
              </span>
            </div>
            <div className="mt-3 flex items-baseline justify-between text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <span>{w.location} · {w.year}</span>
              <span>{w.credit}</span>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
