"use client";

import Link from "next/link";
import { useTheme } from "@/lib/theme";

export function BridalSkinPrepClient() {
  const { theme } = useTheme();
  return (
    <main className="min-h-screen">
      <article className="mx-auto max-w-3xl px-6 pt-10 pb-24">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Guide · Bridal</p>
        <h1 className="mt-3 font-display text-[clamp(2.25rem,5vw,4rem)] leading-[1.05]">
          Bridal skin prep: a 6-week routine for wedding makeup that photographs.
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-foreground/85">
          Wedding makeup lives or dies on the skin beneath it. As a New York
          makeup artist working across editorial and bridal, my whole approach
          starts with the surface — because the camera does too. This is the
          routine I give every bride at their trial, distilled.
        </p>

        <section className="mt-14">
          <h2 className="font-display text-2xl">Six weeks out — reset</h2>
          <p className="mt-3 text-foreground/85">
            Simplify. Pause any new acids, retinoids, or in-clinic treatments
            you haven't already tested. This is not the time to introduce
            heroes; it is the time to protect what already works.
          </p>
          <ul className="mt-4 space-y-2 text-foreground/85">
            <li>— Gentle gel or cream cleanser, morning and night.</li>
            <li>— A single, familiar vitamin C serum in the AM.</li>
            <li>— SPF 30–50 every day, without exception.</li>
            <li>— Stop new exfoliants; keep only what your skin is used to.</li>
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl">Four weeks out — build the glow</h2>
          <p className="mt-3 text-foreground/85">
            This is your window for a gentle facial (hydrating, not
            resurfacing) and for dialing in hydration. Skin that holds water
            reflects light — that dewy quality wedding photos are famous for
            is really just well-hydrated skin catching a soft key light.
          </p>
          <ul className="mt-4 space-y-2 text-foreground/85">
            <li>— Add a hyaluronic-acid serum on damp skin before moisturizer.</li>
            <li>— Sleep with a barrier-supporting cream (ceramides, squalane).</li>
            <li>— Book a lymphatic facial or gua sha session, not a peel.</li>
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl">Two weeks out — protect</h2>
          <p className="mt-3 text-foreground/85">
            Do nothing new. No first-time facials, no lash lifts you haven't
            worn, no bold brow reshaping. The goal for the last fortnight is a
            calm barrier and predictable skin.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl">The week of — quiet the noise</h2>
          <ul className="mt-4 space-y-2 text-foreground/85">
            <li>— Cut back on salt, alcohol, and late nights; all show under a camera.</li>
            <li>— Two liters of water a day, minimum.</li>
            <li>— A hydrating sheet mask the night before — not the morning of.</li>
            <li>— Sleep on a clean silk pillowcase.</li>
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl">Morning-of ritual</h2>
          <ol className="mt-4 space-y-2 text-foreground/85 [counter-reset:step]">
            <li>1. Cleanse gently — no scrubbing, no hot water.</li>
            <li>2. Damp-skin hyaluronic serum, then a light moisturizer.</li>
            <li>3. A cool jade or steel roller for two minutes to depuff.</li>
            <li>4. SPF, always — even for indoor ceremonies with big windows.</li>
            <li>5. Eat something. Makeup on an empty stomach photographs anxious.</li>
          </ol>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl">What to avoid</h2>
          <ul className="mt-4 space-y-2 text-foreground/85">
            <li>— First-time retinoids in the final month.</li>
            <li>— Any peel, laser, or micro-needling inside three weeks.</li>
            <li>— Threading or waxing the day before — do it 48–72 hours out.</li>
            <li>— New SPFs on the wedding morning; test them beforehand.</li>
          </ul>
        </section>

        <div className="mt-16 border-t border-border pt-10">
          <p className="text-foreground/85">
            Every bride's skin is different, and this routine is a starting
            point — not a prescription. At your trial we'll adapt it to your
            skin, your venue's light, and the register you want on the day.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/book?service=bridal&register=${theme}`}
              className="inline-block border border-foreground bg-foreground px-6 py-3 text-xs uppercase tracking-[0.3em] text-background hover:bg-transparent hover:text-foreground"
            >
              Book a bridal trial
            </Link>
            <Link
              href="/services"
              className="inline-block border border-foreground px-6 py-3 text-xs uppercase tracking-[0.3em] hover:bg-foreground hover:text-background"
            >
              See all services
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
