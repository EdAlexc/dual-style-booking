"use client";

// Live services from the platform's admin catalog, with the hardcoded list
// as the always-valid fallback (missing config, network failure, or an
// empty catalog). Shared by the Services page and the booking flow so both
// always show the same offerings under the same slugs.

import { useEffect, useState } from "react";
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
