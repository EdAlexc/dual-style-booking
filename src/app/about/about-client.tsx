"use client";

import Link from "next/link";
import { useTheme } from "@/lib/theme";

const PRESS = ["Hermès", "Elle UK", "Swarovski", "wet n' wild Beauty", "Laura Mercier", "MAC", "Black Haus", "Astarte Creative"];

export function AboutClient() {
  const { theme } = useTheme();
  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-7xl px-6 pt-10 pb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">About</p>
        <h1 className="mt-3 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[1]">
          Two signature styles - all-in-one makeup service.
        </h1>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="space-y-4">
            <p className="text-md leading-relaxed text-foreground/85">
              Emmanuel De Jesus is an eclectic and versatile artist. Born and Raised in Puerto Rico,
              He moved to NYC over a decade ago to further his career as a Model, Dancer and Makeup
              Artist. As a dancer/model he has worked and toured around the world. Credits include
              Hermès, Elle UK, Swarovski. His career as a performer solidified his love for stage
              makeup artistry.
            </p>
            <p className="text-md leading-relaxed text-foreground/85">
              He collaborates with his clients to individually tailor and design
              beauty with makeup. He excels in perfecting and elevating the client's expectations
              with his artistry while staying true to their vision. Trends and Glam do not fit all
              when it comes to his makeup. He has the range to create flawless naked skin, as well
              as transformative theatrical gender-bending art.
            </p>
          </div>
          <div className="space-y-4">
            <p className="text-md leading-relaxed text-foreground/85">
              With over 15 years of experience, he has worked as an artist for Laura Mercier
              and MAC cosmetics in Manhattan's Flagship stores and 5th Avenue. Every skin tone,
              all ages, every skin type, and many unconventional features have been through his chair.
            </p>
            <p className="text-md leading-relaxed text-foreground/85">
              He specializes in creative makeup for stage, nightlife, and events working
              for New York's main entertainment events creatives like Black Haus, Screaming Queens,
              Astarte Creative, etc.
            </p>
          </div>
        </div>

        <div className="mt-16 border-t border-border pt-10">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Brand collaborations and partnerships</p>
          <ul className="mt-6 flex flex-wrap gap-x-10 gap-y-4 font-display text-2xl text-foreground/70">
            {PRESS.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </div>

        <div className="mt-16">
          <Link
            href={`/book?register=${theme}`}
            className="inline-block border border-foreground bg-foreground px-6 py-3 text-xs uppercase tracking-[0.3em] text-background hover:bg-transparent hover:text-foreground"
          >
            Book a session
          </Link>
        </div>
      </section>
    </main>
  );
}
