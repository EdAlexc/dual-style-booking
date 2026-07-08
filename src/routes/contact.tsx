import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";

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

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z
    .string()
    .trim()
    .max(30, "Phone must be less than 30 characters")
    .regex(/^[+()\-\s\d]*$/, "Enter a valid phone number")
    .optional()
    .or(z.literal("")),
  subject: z.string().trim().min(1, "Subject is required").max(150),
  message: z.string().trim().min(1, "Message is required").max(1000),
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string") fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setStatus("sending");
    const subject = encodeURIComponent(result.data.subject);
    const phoneLine = result.data.phone ? `\nPhone: ${result.data.phone}` : "";
    const body = encodeURIComponent(
      `${result.data.message}\n\n— ${result.data.name} (${result.data.email})${phoneLine}`,
    );
    window.location.href = `mailto:hello@studio-mua.com?subject=${subject}&body=${body}`;
    setStatus("sent");
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  };


  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-7xl px-6 pt-6 pb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Contact</p>
        <h1 className="mt-3 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[1]">
          Say hello.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-foreground/85">
          For bookings and press inquiries. Replies within two business days.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-24">
        <form onSubmit={onSubmit} noValidate className="space-y-6">

          <div>
            <label htmlFor="name" className="block text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              maxLength={100}
              className="mt-2 w-full border-b border-foreground/30 bg-transparent py-2 font-display text-xl outline-none focus:border-foreground"
            />
            {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              maxLength={255}
              className="mt-2 w-full border-b border-foreground/30 bg-transparent py-2 font-display text-xl outline-none focus:border-foreground"
            />
            {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Phone <span className="text-foreground/50">(Optional)</span>
            </label>
            <input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              maxLength={30}
              className="mt-2 w-full border-b border-foreground/30 bg-transparent py-2 font-display text-xl outline-none focus:border-foreground"
            />
            {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
          </div>

          <div>
            <label htmlFor="subject" className="block text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Subject
            </label>
            <input
              id="subject"
              type="text"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              maxLength={150}
              className="mt-2 w-full border-b border-foreground/30 bg-transparent py-2 font-display text-xl outline-none focus:border-foreground"
            />
            {errors.subject && <p className="mt-1 text-xs text-destructive">{errors.subject}</p>}
          </div>



          <div>
            <label htmlFor="message" className="block text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Message
            </label>
            <textarea
              id="message"
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              maxLength={1000}
              className="mt-2 w-full border-b border-foreground/30 bg-transparent py-2 text-base outline-none focus:border-foreground resize-none"
            />
            {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
          </div>

          <div className="flex items-center gap-6">
            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-block border border-foreground bg-foreground px-6 py-3 text-xs uppercase tracking-[0.3em] text-background hover:bg-transparent hover:text-foreground disabled:opacity-50"
            >
              {status === "sending" ? "Sending…" : "Send message"}
            </button>
            {status === "sent" && (
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Thanks — opening your email app.</p>
            )}
          </div>
        </form>

        <dl className="mt-16 grid gap-8 sm:grid-cols-2">
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
            className="inline-block border border-foreground px-6 py-3 text-xs uppercase tracking-[0.3em] hover:bg-foreground hover:text-background"
          >
            Or book directly →
          </Link>
        </div>
      </section>
    </main>
  );
}
