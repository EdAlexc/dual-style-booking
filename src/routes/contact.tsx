import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Studio MUA" },
      { name: "description", content: "Get in touch to inquire about editorial, bridal, or event bookings." },
      { property: "og:title", content: "Contact — Studio MUA" },
      { property: "og:description", content: "Get in touch to inquire about editorial, bridal, or event bookings." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-3xl px-6 py-24">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Contact</p>
        <h1 className="mt-3 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[1]">
          Say hello.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-foreground/85">
          For bookings and press inquiries. Replies within two business days.
        </p>

        <dl className="mt-12 grid gap-8 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Email</dt>
            <dd className="mt-2 font-display text-2xl">hello@studio-mua.com</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Studio</dt>
            <dd className="mt-2 font-display text-2xl">New York, NY</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Instagram</dt>
            <dd className="mt-2 font-display text-2xl">@studio.mua</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Representation</dt>
            <dd className="mt-2 font-display text-2xl">The Wall Group</dd>
          </div>
        </dl>

        <div className="mt-16">
          <Link
            to="/book"
            className="inline-block border border-foreground bg-foreground px-6 py-3 text-xs uppercase tracking-[0.3em] text-background hover:bg-transparent hover:text-foreground"
          >
            Or book directly →
          </Link>
        </div>
      </section>
    </main>
  );
}
