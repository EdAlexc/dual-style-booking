# CLAUDE_STATUS_UPDATES

Running log of platform-attachment work so development can resume in later
sessions. Newest entry first.

## 2026-08-20 — Attach site to the Emmanuel de Jesus MUA account (tenant `db53773b-a76e-46b4-9fdd-4ee07c7ac6e6`)

### Already true before this session (verified, not changed)

- The site key in `.env` (`pk_b9ac…`) is bound to tenant
  `emmanuel-de-jesus-mua` (`db53773b-a76e-46b4-9fdd-4ee07c7ac6e6`) in the
  UR Space platform (`~/repos/webapps/creatives_portfolio_webapp`, Neon
  project `ur-space` / `shiny-unit-22371070`, branch `main`).
- Origin allowlist on the `sites` row covers this site's deploys:
  `https://dual-style-booking.vercel.app`, `https://edalexc.github.io`,
  `http://localhost:3000`, `http://localhost:3005`.
- Contact form `1bbe3bab-ad19-49a0-b38c-b07d8ea32438` belongs to the same
  tenant and is published.
- Tenant catalog has 5 visible services; live bookings/services/contact
  flows were already wired (PR #16).
- Tenant membership: `ec.eventproductions@gmail.com` is `owner`. (If
  Emmanuel needs his own login, invite him via the platform's Team screen —
  membership is a platform concern, nothing site-side.)

### Done this session

1. **Imported the legacy historical bookings into the platform tenant** so
   the whole history is manageable in UR Space. Ran the platform's own
   `scripts/import-tenant-data.mjs` (5 inserted, 0 skipped; recorded in
   `import_runs` id `9830d470-f569-4cb4-b595-d80d6bad5365`). Each imported
   booking carries `external_ref = legacy_bookings:<legacy uuid>` and its
   original `SM-XXXX` reference in `custom_fields.reference`; CRM contacts
   were created/linked by the importer (4 contacts total on the tenant).
   - Source: this site's legacy Neon project `dual-style-booking`
     (`lucky-rain-45813209`), table `bookings` (7 rows).
   - Decisions: excluded the 2 rows explicitly marked "safe to delete"
     (`SM-NEONTEST`, `SM-V5YL3Z`); imported the other 5 (incl. Eduardo's two
     July test bookings — delete in admin if unwanted). Imported status =
     `approved` (past events; `pending` would clutter the action queue).
     Names split on last space (platform `splitName` convention), end time =
     start + 2h (matches the live `/api/v1/bookings` insert).
   - Mechanics: rows were staged into a temporary `legacy_bookings` table on
     the platform DB (the source project's connection string wasn't
     obtainable in-session), imported via the CLI, then the staging table
     was dropped. `--dry-run` validated first.
2. **Removed the dead legacy path from this repo** (no UI change):
   deleted `src/lib/neon.ts` (was imported nowhere), dropped
   `@neondatabase/neon-js` from package.json/lockfile, removed
   `NEXT_PUBLIC_NEON_*` from `.env` / `.env.example`, updated README and a
   stale comment in `src/lib/platform.ts`.
3. **Verified**: `GET https://www.ur-space.online/api/v1/services` returns
   the tenant catalog with this site's key+Origin (200). `npm run build`
   passes (lint + types). Dev server renders `/services`, `/book` step 1,
   and `/contact` with the LIVE catalog (incl. the admin-only "Bridal
   Shoot" service — proof the platform data is flowing). Platform repo:
   555/555 unit tests pass (integration suites deliberately not run — see
   below).

### Needs attention (platform repo — not this repo's code)

- **`~/repos/webapps/creatives_portfolio_webapp/.env.local` points at the
  PRODUCTION main branch** of the `ur-space` Neon project, contrary to the
  repo's own `scripts/check-db-target.mjs` convention (test branch). Its
  vitest *integration* suites mutate whatever DB `.env.local` names, so
  they were NOT run this session. Re-point `.env.local` at a migrated test
  branch, then run the full suite.
- **`APP_DATABASE_URL` in that `.env.local` has a stale `app_user`
  password** (auth fails). The import therefore ran on the importer's
  documented owner-connection fallback (explicit tenant scoping still
  applied; RLS backstop skipped). Refresh the value (e.g. `vercel env
  pull`) so future imports/tests get the RLS backstop.

### Possible next slices (deferred — none block the tenant today)

- **Hero/Work videos via the platform**: the platform exposes
  `GET /api/v1/videos` (tenant-managed hero assignments), but the landing
  heroes still use `NEXT_PUBLIC_MUX_PLAYBACK_ID_*` env vars and the Work
  page reads the Mux env directly with server-only credentials. Driving
  both from the platform would let the tenant manage video without deploys.
- **Custom domain**: when the site gets a real domain, add it in platform
  Settings → Domains (writes `tenant_domains`) and append the origin to the
  site's `allowed_origins`.
- **Decommission the legacy Neon project** `lucky-rain-45813209`: its data
  now lives in the platform (traceable via `external_ref`). Left untouched
  as a backup — delete/pause it once the user confirms (2 unimported
  "safe to delete" test rows remain there by design).
- **CRM tidy-up in admin (user's call)**: the pre-existing "Connectivity
  Check (safe to delete)" booking/contact from the Aug 10 connectivity test,
  and Eduardo's imported July test bookings, can be deleted in the admin UI.
