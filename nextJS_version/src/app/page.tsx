import { HomeClient } from "./_components/home-client";

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Studio MUA",
  description:
    "Editorial and bridal makeup artistry in New York City. Glam and Bold registers for weddings, editorial, campaign, and events.",
  url: "https://duel-style-booking.lovable.app",
  areaServed: "New York City",
  address: { "@type": "PostalAddress", addressLocality: "New York", addressRegion: "NY", addressCountry: "US" },
  image:
    "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/e7837322-9d67-4d6a-b1bd-4d8a0b656d1e/id-preview-efa2f4ff--07843970-8c6d-40d4-984d-63f9c6f0cd43.lovable.app-1783551023987.png",
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <HomeClient />
    </>
  );
}
