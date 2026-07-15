import type { Metadata } from "next";

import { AboutClient } from "./about-client";

export const metadata: Metadata = {
  title: "About — Studio MUA",
  description: "An award winning New York-based (travel avail) makeup artist working across editorial, bridal, and theatre.",
  openGraph: {
    title: "About — Studio MUA",
    description: "An award winning New York-based (travel avail) makeup artist working across editorial, bridal, and theatre.",
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
