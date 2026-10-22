export type Service = {
  slug: string;
  name: string;
  price: string;
  duration: string;
  description: string;
  includes: string[];
  /**
   * Platform theme this service is filed under ("Glam" / "Bold" in the admin
   * catalog). Absent on the hardcoded fallback list, which is shown under
   * either register.
   */
  theme?: string;
};

export const SERVICES: Service[] = [
  {
    slug: "bridal",
    name: "Bridal",
    price: "From $650",
    duration: "3 hours",
    description:
      "A soft, luminous look built to last from ceremony to last dance. Skin prep, custom lash, on-site touch-up kit.",
    includes: ["Consultation", "Trial session", "On-location", "Touch-up kit"],
  },
  {
    slug: "editorial",
    name: "Editorial",
    price: "From $1,200 / day",
    duration: "Full day",
    description:
      "Publications, campaigns, lookbooks. Concept-first collaboration with photographers and creative directors.",
    includes: ["Concept call", "Mood boarding", "Set day", "Retouch notes"],
  },
  {
    slug: "events",
    name: "Events & Red Carpet",
    price: "From $450",
    duration: "90 minutes",
    description:
      "Camera-ready makeup for premieres, galas, and stage. Bold or clean — you pick the register.",
    includes: ["Skin prep", "Custom lash", "Setting for lights"],
  },
  {
    slug: "lessons",
    name: "One-to-One Lessons",
    price: "From $300",
    duration: "2 hours",
    description:
      "Personal masterclass in your own kit. Learn techniques tailored to your features and lifestyle.",
    includes: ["Kit review", "Two full looks", "Take-home notes"],
  },
];

/**
 * "Includes" bullets are site presentation, not platform data — the admin
 * catalog carries name/description/price/duration only. Keyed by slugified
 * service name so admin-managed services keep their bullets; a service
 * without an entry simply renders no Includes section.
 */
export const INCLUDES_BY_SLUG: Record<string, string[]> = {
  bridal: ["Consultation", "Trial session", "On-location", "Touch-up kit"],
  editorial: ["Concept call", "Mood boarding", "Set day", "Retouch notes"],
  events: ["Skin prep", "Custom lash", "Setting for lights"],
  "events-red-carpet": ["Skin prep", "Custom lash", "Setting for lights"],
  lessons: ["Kit review", "Two full looks", "Take-home notes"],
  "one-to-one-lessons": ["Kit review", "Two full looks", "Take-home notes"],
};

export type WorkPiece = {
  slug: string;
  title: string;
  theme: "glam" | "bold";
  location: string;
  year: number;
  credit: string;
  url: string;
  /** Public URL of the card's photo (Neon Object Storage); when set, the
   * card shows this image. */
  imageUrl?: string;
};

// To give a piece a photo, upload it to the "work-images" bucket (see
// src/lib/neon-storage.ts) and paste the object's public URL here, e.g.
// imageUrl: "https://br-....storage.c-3.us-east-2.aws.neon.tech/work-images/glam/champagne.jpg".
export const WORK: WorkPiece[] = [
  { slug: "dune-daughter", title: "Dune, Daughter", theme: "bold", location: "Brooklyn", year: 2026, credit: "Photographer: L. Ito", url: "https://www.instagram.com/stories/highlights/17981774548470680/" },
  { slug: "ivory-in-june", title: "Ivory, In June", theme: "glam", location: "West Village", year: 2026, credit: "Photographer: A. Marín", url: "https://example.com/ivory-in-june" },
  { slug: "black-satin", title: "Black Satin", theme: "bold", location: "Bushwick", year: 2025, credit: "Vogue Italia — Beauty", url: "https://example.com/black-satin" },
  { slug: "champagne", title: "Champagne", theme: "glam", location: "Upper East", year: 2025, credit: "Bridal — private", url: "https://example.com/champagne" },
  { slug: "high-wire", title: "High Wire", theme: "bold", location: "Times Sq", year: 2025, credit: "Campaign — NARS", url: "https://example.com/high-wire" },
  { slug: "peach-linen", title: "Peach Linen", theme: "glam", location: "Sag Harbor", year: 2024, credit: "Editorial — Cereal", url: "https://example.com/peach-linen" },
];
