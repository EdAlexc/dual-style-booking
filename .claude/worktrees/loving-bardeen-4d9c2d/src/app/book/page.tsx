import type { Metadata } from "next";
import { Suspense } from "react";

import { BookClient } from "./book-client";

export const metadata: Metadata = {
  title: "Book a Session — Emmanuel de Jesus MUA",
  description: "Request a Glam or Bold makeup session. Bridal, editorial, events, and lessons.",
  openGraph: {
    title: "Book a Session — Emmanuel de Jesus MUA",
    description: "Request a Glam or Bold makeup session.",
  },
};

export default function BookPage() {
  return (
    <Suspense>
      <BookClient />
    </Suspense>
  );
}
