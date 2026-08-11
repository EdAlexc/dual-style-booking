import type { Metadata } from "next";
import { Suspense } from "react";

import { listMuxWork } from "@/lib/mux-assets";
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

export default async function WorkPage() {
  // Live pieces from the client's Mux environment; the hardcoded list is the
  // fallback until videos are uploaded (and on builds without credentials,
  // e.g. the GitHub Pages export).
  const pieces = (await listMuxWork()) ?? WORK;

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Selected Work — Emmanuel de Jesus",
    description: "Editorial, campaign, and bridal makeup portfolio.",
    hasPart: pieces.map((w) => ({
      "@type": "CreativeWork",
      name: w.title,
      ...(w.location ? { locationCreated: w.location } : {}),
      dateCreated: String(w.year),
      ...(w.credit ? { creditText: w.credit } : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <Suspense>
        <WorkClient pieces={pieces} />
      </Suspense>
    </>
  );
}
