import type { Metadata } from "next";
import { Suspense } from "react";

import { listNeonWork } from "@/lib/neon-storage";
import { WORK } from "@/lib/site-data";
import { WorkClient } from "./work-client";

// Re-list the bucket at most every 5 minutes so an upload shows up without
// a deploy (ISR); listNeonWork's AWS SDK call bypasses Next's fetch cache,
// so the window has to be set explicitly here.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Work — Emmanuel de Jesus MUA",
  description: "Selected editorial, campaign, and bridal makeup by Emmanuel de Jesus.",
  openGraph: {
    title: "Work — Emmanuel de Jesus MUA",
    description: "Selected editorial, campaign, and bridal makeup.",
  },
};

export default async function WorkPage() {
  // Live pieces from the client's Neon Object Storage bucket; the hardcoded
  // list is the fallback until photos are uploaded (and on builds without
  // credentials, e.g. the GitHub Pages export).
  const pieces = (await listNeonWork()) ?? WORK;

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
