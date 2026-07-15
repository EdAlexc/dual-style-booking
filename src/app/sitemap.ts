import type { MetadataRoute } from "next";

// Required for the GitHub Pages build (output: "export").
export const dynamic = "force-static";

const BASE_URL = "https://duel-style-booking.lovable.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE_URL}/`, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/work`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/services`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/book`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/contact`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/bridal-skin-prep`, changeFrequency: "monthly", priority: 0.7 },
  ];
}
