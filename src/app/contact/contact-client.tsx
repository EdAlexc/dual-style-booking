"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { z } from "zod";
import { submitContactMessage } from "@/lib/platform";
import { useTheme } from "@/lib/theme";

function makeReference() {
  return "CT-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

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

export function ContactClient() {
  const { theme } = useTheme();
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [feedback, setFeedback] = useState<string | null>(null);
  // One reference per message: retrying a failed send reuses it (the
  // platform's Idempotency-Key), so the message can never double-deliver.
  const referenceRef = useRef(makeReference());

  const onSubmit = async (e: React.FormEvent) => {
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
    // The message goes to the clientflow platform (Contact form on
    // /api/v1/forms), which stores it in the CRM and emails the studio's
    // inbox — no dependence on the visitor's mail client.
    const outcome = await submitContactMessage({
      reference: referenceRef.current,
      name: result.data.name,
      email: result.data.email,
      phone: result.data.phone || null,
      subject: result.data.subject,
      message: result.data.message,
    });
    if (!outcome.ok) {
      setStatus("error");
      setFeedback(outcome.error ?? "We couldn't send your message. Please try again.");
      return;
    }
    setStatus("sent");
    setFeedback(outcome.confirmation ?? "Thanks — your message is on its way.");
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    referenceRef.current = makeReference();
  };


  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-7xl px-6 pt-10 pb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Contact</p>
        <h1 className="mt-3 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[1]">
          Contact Emmanuel
        </h1>
        <p className="mt-6 max-w-xl text-lg text-foreground/85">
          Use this form mainly for press and special inquiries.
          For bookings, please request a quote and date via the "Book Now" button.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="max-w-2xl">
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

          <div className="flex flex-wrap items-center gap-6">
            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-block border border-foreground bg-foreground px-6 py-3 text-xs uppercase tracking-[0.3em] text-background hover:bg-transparent hover:text-foreground disabled:opacity-50"
            >
              {status === "sending" ? "Sending…" : "Send message"}
            </button>
            {status === "sent" && feedback && (
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{feedback}</p>
            )}
            {status === "error" && feedback && (
              <p className="text-xs uppercase tracking-[0.3em] text-destructive">{feedback}</p>
            )}
          </div>
          </form>
        </div>

        <dl className="mt-16 grid gap-8 md:grid-cols-3 md:[&>*]:text-start">
          <div>
            <dt className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Email</dt>
            <a href="mailto:emjoedasilva@outlook.com" className="mt-2 font-display text-xl hover:underline">
              emjoedasilva@outlook.com
            </a>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Instagram</dt>
            <a href="https://www.instagram.com/muabyedj/" target="_blank" className="mt-2 font-display text-xl hover:underline">
              @muabyedj
            </a>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Tel</dt>
            <a href="tel:+19179750060" className="mt-2 font-display text-xl hover:underline">
              +1 (917)-975-0060
            </a>
          </div>
        </dl>


        <div className="mt-16">
          <Link
            href={`/book?register=${theme}`}
            className="inline-block border border-foreground px-6 py-3 text-xs uppercase tracking-[0.3em] hover:bg-foreground hover:text-background"
          >
            Or book directly →
          </Link>
        </div>
      </section>
    </main>
  );
}
