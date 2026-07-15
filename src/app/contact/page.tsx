import type { Metadata } from "next";

import { ContactClient } from "./contact-client";

export const metadata: Metadata = {
  title: "Contact — Studio MUA",
  description: "Get in touch to inquire about editorial, bridal, or event bookings.",
  openGraph: {
    title: "Contact — Studio MUA",
    description: "Get in touch to inquire about editorial, bridal, or event bookings.",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
