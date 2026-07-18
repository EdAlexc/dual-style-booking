import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Providers } from "@/components/providers";
import "../styles.css";

const SITE_TITLE = "Emmanuel de Jesus MUA — Book a Session";
const SITE_DESCRIPTION =
  "Editorial and bridal makeup artistry. Book Glam or Bold sessions with a New York-based makeup artist.";
const OG_IMAGE =
  "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/e7837322-9d67-4d6a-b1bd-4d8a0b656d1e/id-preview-efa2f4ff--07843970-8c6d-40d4-984d-63f9c6f0cd43.lovable.app-1783551023987.png";

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  authors: [{ name: "Emmanuel de Jesus MUA" }],
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: "website",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  verification: {
    google: "g9fClCG7Z0qRh2rPrFeBIbVcwNDRZp-JLshVeMu7fnI",
  },
  icons: {
    // Next doesn't apply basePath to metadata URLs, so prefix it ourselves
    // (empty outside the GitHub Pages build).
    icon: [{ url: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/favicon.ico`, type: "image/x-icon" }],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://duel-style-booking.lovable.app/#organization",
      name: "Emmanuel de Jesus MUA",
      url: "https://duel-style-booking.lovable.app",
      description: "Editorial and bridal makeup artistry in New York City.",
    },
    {
      "@type": "WebSite",
      "@id": "https://duel-style-booking.lovable.app/#website",
      url: "https://duel-style-booking.lovable.app",
      name: "Emmanuel de Jesus MUA",
      publisher: { "@id": "https://duel-style-booking.lovable.app/#organization" },
    },
  ],
};

// Applies the persisted theme before first paint to avoid a flash of the
// default glam theme (and a hydration mismatch on <html data-theme>).
const themeInitScript = `(function(){try{var t=localStorage.getItem("mua-theme");if(t==="glam"||t==="bold")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="glam" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400&family=Archivo:wght@400;600;800;900&family=Inter:wght@300;400;500;600&display=swap"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
