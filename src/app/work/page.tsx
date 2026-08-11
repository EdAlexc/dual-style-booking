import type { Metadata } from "next";
import { Suspense } from "react";

import { WORK } from "@/lib/site-data";
import { WorkClient } from "./work-client";

export const metadata: Metadata = {
  title: "Work — Emmanuel de Jesus MUA",
  description: "Selected editorial, campaign, and bridal makeup by Emmanuel de Jesus.",
  openGraph: {
    title: "Work — Emmanuel de Jesus MUA",
    description: "Selected editorial, campaign, and bridal makeup.",
  },
};

const collectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Selected Work — Emmanuel de Jesus",
  description: "Editorial, campaign, and bridal makeup portfolio.",
  hasPart: WORK.map((w) => ({
    "@type": "CreativeWork",
    name: w.title,
    locationCreated: w.location,
    dateCreated: String(w.year),
    creditText: w.credit,
  })),
};

export default function WorkPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <Suspense>
        <WorkClient />
      </Suspense>
    </>
  );
}
