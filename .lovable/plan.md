
# Makeup Artist Booking Site — Plan

A cinematic, editorial one-artist site inspired by marcksalazarmua.com, with a signature landing interaction: instead of a glassmorphism "+" toggle, the landing is split diagonally into two panels — Glam (top-left) and Bold (bottom-right). Both video panels render black until the user hovers a panel; hovering reveals the video and shifts the site's active theme.

## Landing Interaction (the centerpiece)

- Full-viewport hero split by a diagonal line (CSS `clip-path: polygon(...)`).
- Two `<video>` elements (muted, loop, playsInline, autoPlay), one per panel, each masked to its diagonal half.
- Default state: both panels overlaid with solid black — video is playing underneath but invisible.
- On hover of a panel:
  - The black overlay on that panel fades out, revealing the video.
  - A large label ("GLAM" / "BOLD"), city + year meta, and a subtle vignette animate in.
  - The site's active theme switches (Glam = soft ivory/rose editorial; Bold = high-contrast noir/red).
- On mobile (no hover): tap-to-toggle; the panel that isn't active stays black. A small hint chip ("Tap to reveal") appears once.
- Accessibility: focusable panel buttons with keyboard reveal, `prefers-reduced-motion` disables video autoplay and uses static poster frames, ARIA labels announce theme.

## Theme System (Glam vs. Bold)

- Two semantic token sets in `src/styles.css` under `:root` and `[data-theme="bold"]`.
  - Glam: warm ivory background, deep plum foreground, blush accent, serif display.
  - Bold: near-black background, bone foreground, crimson accent, condensed sans display.
- Active theme stored in a `ThemeProvider` (React context) — set from the landing hover/tap and persisted in `localStorage`.
- All subsequent pages read the current theme; a small header toggle lets the user switch anywhere.

## Pages / Routes

Each route file gets its own `head()` (title, description, og:title, og:description). No `og:image` on `__root`; add on leaf routes where a meaningful hero exists.

```
src/routes/
  __root.tsx          shell + header/footer, theme provider, fonts via <link>
  index.tsx           diagonal-split landing (Glam/Bold reveal)
  work.tsx            portfolio grid (editorial masonry, filter Glam/Bold/All)
  work.$slug.tsx      case study: hero image, credits, gallery
  about.tsx           bio, press logos, philosophy
  services.tsx        service list w/ pricing tiers (Bridal, Editorial, Events, Lessons)
  book.tsx            multi-step booking form (service → date → details → confirm)
  contact.tsx         inquiry form + socials
```

## Booking Flow (`/book`)

Multi-step client-side form:
1. Service selection (cards from `services.tsx` data).
2. Date + time slot picker (calendar UI, disable past dates; slots are a static list for now).
3. Client details (name, email, phone, event location, notes, references upload optional).
4. Review + submit.

Submission target: Lovable Cloud (Supabase). A `bookings` table stores requests; a public-anon `INSERT`-only RLS policy allows submissions without auth. A confirmation screen shows a reference number. Cloud will be enabled when the user approves — I'll flag it as part of implementation.

Optional (not in v1 unless requested): email notification via a server function using Resend.

## Design Direction

- Editorial, cinematic, generous whitespace, oversized type, muted motion.
- Serif display (Glam) + condensed grotesque (Bold), both loaded via `<link>` in `__root.tsx` head, referenced via `--font-*` in `@theme`.
- Micro-interactions: `story-link` underline on nav, subtle `fade-in` on scroll sections, `hover-scale` on portfolio tiles.
- All colors via semantic tokens — no hard-coded hex in components.

## Technical Notes

- Diagonal split: two absolutely-positioned panels, each `clip-path: polygon(0 0, 100% 0, 0 100%)` and `polygon(100% 0, 100% 100%, 0 100%)`. Videos sit inside; a same-shaped black `<div>` overlay sits above and fades to opacity 0 on hover/focus.
- Videos: placeholder MP4s (short loops) served from `/public/videos/`; the user can swap real assets later. Poster frames rendered first for LCP.
- Theme provider: React context + `data-theme` attribute on `<html>`; SSR-safe by reading `localStorage` only in an effect and defaulting to `glam`.
- No Three.js / WebGL / heavy libs. Framer Motion optional for reveal transitions.
- Header hides on the landing route (so the diagonal is uninterrupted) and appears on all other routes.

## Content Placeholders

Copy, artist name, city, and imagery are placeholders ("Studio Name", NYC, 2026). User can replace after review. Portfolio uses tasteful stock/generated images matching each theme.

## Out of Scope for v1

- Real payments/deposits (can be added via Stripe later).
- Authenticated client dashboard.
- Admin panel for managing bookings (data is viewable in Cloud dashboard).

Approve to proceed and I'll enable Lovable Cloud, scaffold the routes, build the diagonal landing, and wire up the booking form.
