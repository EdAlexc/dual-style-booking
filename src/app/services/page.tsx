import type { Metadata } from "next";

import { SERVICES } from "@/lib/site-data";
import { ServicesClient } from "./services-client";

export const metadata: Metadata = {
  title: "Services & Pricing — Studio MUA",
  description: "Bridal, editorial, events, and one-to-one lessons. Transparent pricing and inclusions.",
  openGraph: {
    title: "Services & Pricing — Studio MUA",
    description: "Bridal, editorial, events, and one-to-one lessons.",
  },
};

const servicesJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Studio MUA Services",
  itemListElement: SERVICES.map((s, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Service",
      name: s.name,
      description: s.description,
      provider: { "@type": "Organization", name: "Studio MUA" },
      offers: { "@type": "Offer", price: s.price, priceCurrency: "USD" },
    },
  })),
};

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }}
      />
      <ServicesClient />
    </>
  );
}
