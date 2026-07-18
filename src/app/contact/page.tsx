import type { Metadata } from "next";

import { ContactClient } from "./contact-client";

export const metadata: Metadata = {
  title: "Contact — Emmanuel de Jesus MUA",
  description: "Get in touch to inquire about editorial, bridal, or event bookings.",
  openGraph: {
    title: "Contact — Emmanuel de Jesus MUA",
    description: "Get in touch to inquire about editorial, bridal, or event bookings.",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
