import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { SERVICES } from "@/lib/site-data";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const searchSchema = z.object({ service: z.string().optional() });

export const Route = createFileRoute("/book")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Book a Session — Studio MUA" },
      { name: "description", content: "Request a Glam or Bold makeup session. Bridal, editorial, events, and lessons." },
      { property: "og:title", content: "Book a Session — Studio MUA" },
      { property: "og:description", content: "Request a Glam or Bold makeup session." },
    ],
  }),
  component: BookPage,
});

const TIME_SLOTS = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"];

type Step = 1 | 2 | 3 | 4;

function makeReference() {
  return "SM-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

function BookPage() {
  const initial = Route.useSearch();
  const { theme } = useTheme();

  const [step, setStep] = useState<Step>(1);
  const [serviceSlug, setServiceSlug] = useState<string>(initial.service ?? "bridal");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);

  const service = useMemo(() => SERVICES.find((s) => s.slug === serviceSlug)!, [serviceSlug]);

  const canNext =
    (step === 1 && !!service) ||
    (step === 2 && !!date && !!time) ||
    (step === 3 && fullName.length > 1 && /.+@.+\..+/.test(email));

  async function submit() {
    if (!date) return;
    setSubmitting(true);
    const ref = makeReference();
    const { error } = await supabase.from("bookings").insert({
      reference: ref,
      service: service.name,
      theme,
      event_date: format(date, "yyyy-MM-dd"),
      event_time: time,
      full_name: fullName,
      email,
      phone: phone || null,
      location: location || null,
      notes: notes || null,
    });
    setSubmitting(false);
    if (error) {
      toast.error("We couldn't submit your request. Please try again.");
      console.error(error);
      return;
    }
    setReference(ref);
    setStep(4);
  }

  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-3xl px-6 py-20">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Book · Step {step === 4 ? "✓" : step} of 3
        </p>
        <h1 className="mt-3 font-display text-[clamp(2.25rem,5vw,4rem)] leading-[1]">
          {step === 4 ? "Received." : "Request a session."}
        </h1>

        <div className="mt-10">
          {step === 1 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {SERVICES.map((s) => (
                <button
                  key={s.slug}
                  onClick={() => setServiceSlug(s.slug)}
                  className={cn(
                    "border p-6 text-left transition-colors",
                    serviceSlug === s.slug
                      ? "border-foreground bg-foreground text-background"
                      : "border-border hover:border-foreground",
                  )}
                >
                  <div className="flex items-baseline justify-between">
                    <span className="font-display text-2xl">{s.name}</span>
                    <span className="text-xs uppercase tracking-[0.2em] opacity-70">{s.duration}</span>
                  </div>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] opacity-80">{s.price}</p>
                  <p className="mt-3 text-sm opacity-80">{s.description}</p>
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <Label className="text-xs uppercase tracking-[0.2em]">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "mt-2 w-full justify-start rounded-none border-border font-normal",
                        !date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon />
                      {date ? format(date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label className="text-xs uppercase tracking-[0.2em]">Preferred time</Label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {TIME_SLOTS.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTime(t)}
                      className={cn(
                        "border px-2 py-2 text-sm transition-colors",
                        time === t
                          ? "border-foreground bg-foreground text-background"
                          : "border-border hover:border-foreground",
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-5">
              <Field label="Full name">
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="rounded-none" />
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Email">
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-none" />
                </Field>
                <Field label="Phone (optional)">
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="rounded-none" />
                </Field>
              </div>
              <Field label="Event location (optional)">
                <Input value={location} onChange={(e) => setLocation(e.target.value)} className="rounded-none" />
              </Field>
              <Field label="Anything I should know?">
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="rounded-none"
                  placeholder="Vibe, references, headcount, allergies…"
                />
              </Field>
            </div>
          )}

          {step === 4 && reference && (
            <div className="border border-border p-8">
              <p className="text-sm text-muted-foreground">
                Thank you, {fullName.split(" ")[0]}. Your request is in. I'll reply within two business days to confirm.
              </p>
              <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
                <Row k="Reference" v={reference} />
                <Row k="Service" v={service.name} />
                <Row k="Date" v={date ? format(date, "PPP") : ""} />
                <Row k="Time" v={time} />
                <Row k="Theme" v={theme} />
              </dl>
            </div>
          )}
        </div>

        {step !== 4 && (
          <div className="mt-10 flex items-center justify-between">
            <button
              onClick={() => setStep((s) => Math.max(1, (s - 1)) as Step)}
              className="text-xs uppercase tracking-[0.3em] text-muted-foreground disabled:opacity-40"
              disabled={step === 1}
            >
              ← Back
            </button>
            {step < 3 ? (
              <button
                onClick={() => setStep((s) => Math.min(3, (s + 1)) as Step)}
                disabled={!canNext}
                className="border border-foreground bg-foreground px-6 py-3 text-xs uppercase tracking-[0.3em] text-background disabled:opacity-40 hover:bg-transparent hover:text-foreground"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={submit}
                disabled={!canNext || submitting}
                className="border border-foreground bg-foreground px-6 py-3 text-xs uppercase tracking-[0.3em] text-background disabled:opacity-40 hover:bg-transparent hover:text-foreground"
              >
                {submitting ? "Sending…" : "Send request"}
              </button>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-xs uppercase tracking-[0.2em]">{label}</Label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between border-b border-border py-2">
      <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{k}</dt>
      <dd className="font-display">{v}</dd>
    </div>
  );
}
