export type Service = {
  slug: string;
  name: string;
  price: string;
  duration: string;
  description: string;
  includes: string[];
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

export type WorkPiece = {
  slug: string;
  title: string;
  theme: "glam" | "bold";
  location: string;
  year: number;
  credit: string;
  /** Mux playback ID; when set, the card plays this video from Mux. */
  muxPlaybackId?: string;
};

// To give a piece video, paste its Mux playback ID (from the Mux dashboard,
// with MP4 support enabled on the asset), e.g. muxPlaybackId: "DS00Spx1CV...".
export const WORK: WorkPiece[] = [
  { slug: "dune-daughter", title: "Dune, Daughter", theme: "bold", location: "Brooklyn", year: 2026, credit: "Photographer: L. Ito" },
  { slug: "ivory-in-june", title: "Ivory, In June", theme: "glam", location: "West Village", year: 2026, credit: "Photographer: A. Marín" },
  { slug: "black-satin", title: "Black Satin", theme: "bold", location: "Bushwick", year: 2025, credit: "Vogue Italia — Beauty" },
  { slug: "champagne", title: "Champagne", theme: "glam", location: "Upper East", year: 2025, credit: "Bridal — private" },
  { slug: "high-wire", title: "High Wire", theme: "bold", location: "Times Sq", year: 2025, credit: "Campaign — NARS" },
  { slug: "peach-linen", title: "Peach Linen", theme: "glam", location: "Sag Harbor", year: 2024, credit: "Editorial — Cereal" },
];
