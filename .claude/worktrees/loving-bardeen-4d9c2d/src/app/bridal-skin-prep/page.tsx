import type { Metadata } from "next";

import { BridalSkinPrepClient } from "./bridal-skin-prep-client";

export const metadata: Metadata = {
  title: "Bridal Skin Prep — A 6-Week Routine for Wedding Makeup | Emmanuel de Jesus",
  description:
    "A camera-first bridal skin prep guide from a New York makeup artist: a 6-week routine, morning-of ritual, and what to avoid before your wedding.",
  alternates: {
    canonical: "https://duel-style-booking.lovable.app/bridal-skin-prep",
  },
  openGraph: {
    title: "Bridal Skin Prep — A 6-Week Routine for Wedding Makeup",
    description:
      "How to prepare your skin for bridal makeup: a camera-first, week-by-week routine and morning-of ritual.",
    type: "article",
    url: "https://duel-style-booking.lovable.app/bridal-skin-prep",
  },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Bridal Skin Prep — A 6-Week Routine for Wedding Makeup",
  description:
    "A camera-first bridal skin prep guide: 6-week routine, morning-of ritual, and what to avoid before your wedding.",
  author: { "@type": "Organization", name: "Emmanuel de Jesus" },
  publisher: { "@type": "Organization", name: "Emmanuel de Jesus" },
  mainEntityOfPage: "https://duel-style-booking.lovable.app/bridal-skin-prep",
};

export default function BridalSkinPrepPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <BridalSkinPrepClient />
    </>
  );
}
