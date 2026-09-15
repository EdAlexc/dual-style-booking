"use client";

// Live services from the platform's admin catalog, with the hardcoded list
// as the always-valid fallback (missing config, network failure, or an
// empty catalog). Shared by the Services page and the booking flow so both
// always show the same offerings under the same slugs.

import { useEffect, useMemo, useState } from "react";
import { fetchServices, type PlatformService } from "@/lib/platform";
import { INCLUDES_BY_SLUG, SERVICES, type Service } from "@/lib/site-data";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toSiteService(s: PlatformService): Service {
  const slug = slugify(s.name);
  return {
    slug,
    name: s.name,
    price: s.price,
    duration: s.duration,
    description: s.description,
    includes: INCLUDES_BY_SLUG[slug] ?? [],
    theme: s.theme || undefined,
  };
}

export function useServices(): Service[] {
  const [services, setServices] = useState<Service[]>(SERVICES);

  useEffect(() => {
    let alive = true;
    fetchServices().then((list) => {
      if (alive && list && list.length > 0) setServices(list.map(toSiteService));
    });
    return () => {
      alive = false;
    };
  }, []);

  return services;
}

/**
 * The catalog narrowed to the active register. The admin files every service
 * under a theme ("Glam" / "Bold"); the site's toggle uses the same words in
 * lowercase, so compare case-insensitively. Services without a theme (the
 * hardcoded fallback) always show. If the platform catalog has nothing under
 * the active register, fall back to the full list rather than an empty page.
 */
export function useServicesForTheme(theme: string): Service[] {
  const all = useServices();
  return useMemo(() => {
    const want = theme.trim().toLowerCase();
    const matching = all.filter(
      (s) => !s.theme || s.theme.trim().toLowerCase() === want,
    );
    return matching.length > 0 ? matching : all;
  }, [all, theme]);
}
