"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { WORK } from "@/lib/site-data";
import { muxMp4Url } from "@/lib/mux";
import { useTheme } from "@/lib/theme";

const filterSchema = z.enum(["all", "glam", "bold"]).catch("all");

type Filter = "all" | "glam" | "bold";

export function WorkClient() {
  const searchParams = useSearchParams();
  const initialFilter = filterSchema.parse(searchParams.get("filter") ?? "all");
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
      <section className="mx-auto max-w-7xl px-6 pt-10 pb-8">
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
              className={`relative aspect-[3/4] overflow-hidden bg-muted ${
                w.theme === "bold" ? "work-card-bold" : "work-card-glam"
              }`}
            >
              {/* Mux footage; the gradient behind stays visible until it loads */}
              {w.muxPlaybackId && (
                <video
                  muted
                  loop
                  playsInline
                  autoPlay
                  preload="metadata"
                  src={muxMp4Url(w.muxPlaybackId)}
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                />
              )}
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
