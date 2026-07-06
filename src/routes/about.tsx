import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Studio MUA" },
      { name: "description", content: "A New York-based makeup artist working across editorial, bridal, and campaign." },
      { property: "og:title", content: "About — Studio MUA" },
      { property: "og:description", content: "A New York-based makeup artist working across editorial, bridal, and campaign." },
    ],
  }),
  component: AboutPage,
});

const PRESS = ["Vogue", "Cereal", "NARS", "The Cut", "Vanity Fair", "British GQ"];

function AboutPage() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-4xl px-6 py-24">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">About</p>
        <h1 className="mt-3 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[1]">
          Two signatures. One eye for the frame.
        </h1>
        <div className="mt-10 grid gap-10 md:grid-cols-2">
          <p className="text-lg leading-relaxed text-foreground/85">
            Studio MUA is the working name of a New York City makeup artist who
            splits her time between editorial sets and private bridal clients.
            Her work sits comfortably in two registers: <em>Glam</em> —
            luminous, ivory, romantic — and <em>Bold</em> — graphic, sculptural,
            unafraid of colour.
          </p>
          <p className="text-lg leading-relaxed text-foreground/85">
            Trained in Paris and mentored through London seasons, she brings a
            camera-first sensibility to every face. Skin is the point of
            departure; the rest is composition.
          </p>
        </div>

        <div className="mt-16 border-t border-border pt-10">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Selected press</p>
          <ul className="mt-6 flex flex-wrap gap-x-10 gap-y-4 font-display text-2xl text-foreground/70">
            {PRESS.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </div>

        <div className="mt-16">
          <Link
            to="/book"
            className="inline-block border border-foreground bg-foreground px-6 py-3 text-xs uppercase tracking-[0.3em] text-background hover:bg-transparent hover:text-foreground"
          >
            Book a session
          </Link>
        </div>
      </section>
    </main>
  );
}
