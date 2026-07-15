import { createClient } from "@neondatabase/neon-js";

// Browser client for the Neon Data API (PostgREST-style).
// `allowAnonymous` makes the SDK fetch and cache a short-lived anonymous JWT,
// so unauthenticated visitors can submit bookings; what they can actually do
// is enforced by Postgres grants + RLS policies on the `bookings` table.
function createNeonClient() {
  const AUTH_URL = process.env.NEXT_PUBLIC_NEON_AUTH_URL;
  const DATA_API_URL = process.env.NEXT_PUBLIC_NEON_DATA_API_URL;

  if (!AUTH_URL || !DATA_API_URL) {
    const missing = [
      ...(!AUTH_URL ? ["NEXT_PUBLIC_NEON_AUTH_URL"] : []),
      ...(!DATA_API_URL ? ["NEXT_PUBLIC_NEON_DATA_API_URL"] : []),
    ];
    const message = `Missing Neon environment variable(s): ${missing.join(", ")}. See .env.example.`;
    console.error(`[Neon] ${message}`);
    throw new Error(message);
  }

  return createClient({
    auth: {
      url: AUTH_URL,
      allowAnonymous: true,
    },
    dataApi: {
      url: DATA_API_URL,
    },
  });
}

let _neon: ReturnType<typeof createNeonClient> | undefined;

// Import the neon client like this:
// import { neon } from "@/lib/neon";
export const neon = new Proxy({} as ReturnType<typeof createNeonClient>, {
  get(_, prop, receiver) {
    if (!_neon) _neon = createNeonClient();
    return Reflect.get(_neon, prop, receiver);
  },
});
