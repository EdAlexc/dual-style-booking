import { createFileRoute, Link } from "@tanstack/react-router";
import { SERVICES } from "@/lib/site-data";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services & Pricing — Studio MUA" },
      { name: "description", content: "Bridal, editorial, events, and one-to-one lessons. Transparent pricing and inclusions." },
      { property: "og:title", content: "Services & Pricing — Studio MUA" },
      { property: "og:description", content: "Bridal, editorial, events, and one-to-one lessons." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-6xl px-6 py-24">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Services</p>
        <h1 className="mt-3 font-display text-[clamp(2.5rem,6vw,5rem)] leading-[1]">
          Every face, given time.
        </h1>

        <div className="mt-16 grid gap-px bg-border md:grid-cols-2">
          {SERVICES.map((s) => (
            <article key={s.slug} className="flex flex-col bg-background p-8 md:p-10">
              <header className="flex items-baseline justify-between">
                <h2 className="font-display text-3xl">{s.name}</h2>
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {s.duration}
                </span>
              </header>
              <p className="mt-2 text-sm uppercase tracking-[0.2em] text-accent">{s.price}</p>
              <p className="mt-4 text-foreground/85">{s.description}</p>
              <p className="mt-6 text-xs uppercase tracking-[0.2em] text-muted-foreground">Includes:</p>
              <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-muted-foreground">
                {s.includes.map((i) => (
                  <li key={i}>— {i}</li>
                ))}
              </ul>
              <div className="mt-auto pt-8">
                <Link
                  to="/book"
                  search={{ service: s.slug }}
                  className="story-link text-xs uppercase tracking-[0.3em]"
                >
                  Book {s.name} →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
