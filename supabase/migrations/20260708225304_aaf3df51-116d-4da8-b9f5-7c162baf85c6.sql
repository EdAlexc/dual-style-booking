-- Replace overly permissive INSERT policy with validated one
DROP POLICY IF EXISTS "Anyone can submit a booking" ON public.bookings;

CREATE POLICY "Anyone can submit a booking"
ON public.bookings
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(btrim(full_name)) BETWEEN 1 AND 100
  AND length(btrim(email)) BETWEEN 3 AND 255
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND length(btrim(service)) BETWEEN 1 AND 100
  AND length(btrim(reference)) BETWEEN 1 AND 50
  AND theme IN ('glam', 'bold')
  AND event_date >= CURRENT_DATE
  AND length(btrim(event_time)) BETWEEN 1 AND 20
  AND (phone IS NULL OR length(phone) <= 30)
  AND (location IS NULL OR length(location) <= 200)
  AND (notes IS NULL OR length(notes) <= 2000)
);

-- Bookings are read only via server-side service_role (admin), never via
-- anon/authenticated clients. Make that explicit with a deny-all SELECT policy
-- so the intent is documented and no future permissive policy is added by accident.
CREATE POLICY "No client read access to bookings"
ON public.bookings
FOR SELECT
TO anon, authenticated
USING (false);