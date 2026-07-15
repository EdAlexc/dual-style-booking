import type { Metadata } from "next";

import { AboutClient } from "./about-client";

export const metadata: Metadata = {
  title: "About — Studio MUA",
  description: "A New York-based makeup artist working across editorial, bridal, and campaign.",
  openGraph: {
    title: "About — Studio MUA",
    description: "A New York-based makeup artist working across editorial, bridal, and campaign.",
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
