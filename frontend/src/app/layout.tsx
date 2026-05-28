import type { Metadata } from "next";
import "./globals.css";

/**
 * Strip height:  32px  (desktop only — hidden on mobile)
 * Navbar height: 64px
 * Total desktop: 96px
 * Total mobile:  64px
 */

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://horizon-hope-academy.vercel.app"
  ),
  title: {
    template: "%s | Horizon Hope Academy Schools",
    default: "Horizon Hope Academy Schools — Shamata, Aberdares",
  },
  description:
    "A caring private school in Shamata, Nyandarua County, near the Aberdare Ranges. " +
    "CBC curriculum PP1 to Grade 9. Committed service to excellence.",
  keywords: [
    "Horizon Hope Academy", "Shamata school", "Nyandarua school",
    "CBC school Kenya", "Aberdares school", "private school Kenya",
    "HorizonHopeAcademy", "horizon hope academy shamata",
    "best school nyandarua", "primary school kenya aberdares",
    "CBC curriculum kenya", "PP1 Grade 9 kenya school",
  ],
  authors: [{ name: "Horizon Hope Academy" }],
  creator: "Horizon Hope Academy",
  publisher: "Horizon Hope Academy",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "https://horizon-hope-academy.vercel.app",
  },
  verification: {
    google: "hiyytQAPfLoual4z2lDVQIXPvC3uiNY5p53AG4e_DlM",
  },
  openGraph: {
    title: "Horizon Hope Academy Schools",
    description: "Committed Service to Excellence — Shamata, Nyandarua County, Kenya",
    images: ["/assets/logo-navbar.png"],
    locale: "en_KE",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/assets/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/assets/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: { url: "/assets/logo-navbar.png", sizes: "800x800" },
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "School",
            "name": "Horizon Hope Academy",
            "alternateName": "HHA",
            "url": "https://horizon-hope-academy.vercel.app",
            "logo": "https://horizon-hope-academy.vercel.app/assets/logo-navbar.png",
            "description": "A caring private school in Shamata, Nyandarua County, Kenya. CBC curriculum PP1 to Grade 9. Committed service to excellence.",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Shamata–Mairo Inne Road",
              "addressLocality": "Shamata",
              "addressRegion": "Nyandarua County",
              "postalCode": "20304",
              "addressCountry": "KE"
            },
            "telephone": "+254722777384",
            "email": "horizonhopeacademy.sc@gmail.com",
            "foundingDate": "1998",
            "numberOfEmployees": {"@type": "QuantitativeValue", "value": 8},
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": -0.4167,
              "longitude": 36.6833
            },
            "openingHours": "Mo-Fr 08:00-17:00",
            "sameAs": []
          })}}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-navy antialiased">
        {children}
      </body>
    </html>
  );
}
