// Client for the clientflow platform's headless API (/api/v1).
//
// Bookings used to be written straight to this site's own Neon project from
// the browser (src/lib/neon.ts); they now POST to the multi-tenant platform,
// authenticated by a PUBLISHABLE site key. The key is not a secret — it only
// authorizes write-only submit endpoints, scoped server-side to this site's
// tenant and Origin allowlist.

export interface PlatformBookingInput {
  /** Client-side reference (e.g. "SM-AB12CD") — echoed back, retry-safe. */
  reference: string;
  service: string;
  /** Site theme at submit time ("glam" | "bold") — free text to the platform. */
  style: string;
  /** "yyyy-MM-dd" */
  eventDate: string;
  /** "HH:mm" */
  eventTime: string;
  fullName: string;
  email: string;
  phone?: string | null;
  location?: string | null;
  notes?: string | null;
}

export interface PlatformBookingResult {
  ok: boolean;
  id?: string;
  error?: string;
}

function config(): { apiUrl: string; siteKey: string } | null {
  const apiUrl = process.env.NEXT_PUBLIC_PLATFORM_API_URL;
  const siteKey = process.env.NEXT_PUBLIC_PLATFORM_SITE_KEY;
  if (!apiUrl || !siteKey) {
    console.error(
      "[platform] Missing NEXT_PUBLIC_PLATFORM_API_URL / NEXT_PUBLIC_PLATFORM_SITE_KEY. See .env.example.",
    );
    return null;
  }
  return { apiUrl: apiUrl.replace(/\/$/, ""), siteKey };
}

/** A visible service from the platform's admin-managed catalog. */
export interface PlatformService {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: string;
  theme: string;
  style: string;
}

/**
 * The tenant's visible services (GET /api/v1/services — public content,
 * same publishable key). Returns null on any failure so callers can fall
 * back to the hardcoded list.
 */
export async function fetchServices(): Promise<PlatformService[] | null> {
  const cfg = config();
  if (!cfg) return null;
  try {
    const res = await fetch(`${cfg.apiUrl}/api/v1/services`, {
      headers: { "x-publishable-key": cfg.siteKey },
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { services?: PlatformService[] };
    return Array.isArray(body.services) ? body.services : null;
  } catch {
    return null;
  }
}

export interface ContactMessageInput {
  /** Client-side reference (e.g. "CT-AB12CD") — the Idempotency-Key. Keep it
   * stable across retries of the same message so a resubmit can never
   * double-deliver. */
  reference: string;
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
}

export interface ContactMessageResult {
  ok: boolean;
  confirmation?: string;
  error?: string;
}

/**
 * Send a contact message through the platform's Contact form
 * (POST /api/v1/forms/:id/submit). The submission lands in the workspace
 * CRM and the platform emails the notification inbox — no mailto:, nothing
 * depends on the visitor's mail client.
 */
export async function submitContactMessage(
  input: ContactMessageInput,
): Promise<ContactMessageResult> {
  const cfg = config();
  const formId = process.env.NEXT_PUBLIC_PLATFORM_CONTACT_FORM_ID;
  if (!cfg || !formId) return { ok: false, error: "The contact form is not configured." };

  try {
    const res = await fetch(`${cfg.apiUrl}/api/v1/forms/${formId}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-key": cfg.siteKey,
        "Idempotency-Key": input.reference,
      },
      body: JSON.stringify({
        name: input.name,
        email: input.email,
        phone: input.phone || undefined,
        subject: input.subject,
        message: input.message,
      }),
    });
    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      return { ok: false, error: body?.error ?? `Request failed (${res.status})` };
    }
    const body = (await res.json()) as { confirmation_message?: string };
    return { ok: true, confirmation: body.confirmation_message };
  } catch (err) {
    console.error("[platform] contact submit failed:", err);
    return { ok: false, error: "Network error — please try again." };
  }
}

export async function submitBooking(
  input: PlatformBookingInput,
): Promise<PlatformBookingResult> {
  const cfg = config();
  if (!cfg) return { ok: false, error: "Booking is not configured." };

  try {
    const res = await fetch(`${cfg.apiUrl}/api/v1/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-key": cfg.siteKey,
        // The local reference doubles as the idempotency key: a retried
        // submit can never double-book.
        "Idempotency-Key": input.reference,
      },
      body: JSON.stringify({
        name: input.fullName,
        email: input.email,
        phone: input.phone || undefined,
        start: `${input.eventDate}T${input.eventTime}`,
        service: input.service,
        style: input.style,
        location: input.location || undefined,
        notes: input.notes || undefined,
        client_reference: input.reference,
      }),
    });

    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      return { ok: false, error: body?.error ?? `Request failed (${res.status})` };
    }
    const body = (await res.json()) as { id: string };
    return { ok: true, id: body.id };
  } catch (err) {
    console.error("[platform] booking submit failed:", err);
    return { ok: false, error: "Network error — please try again." };
  }
}
