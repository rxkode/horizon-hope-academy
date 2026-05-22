import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

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
  ],
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
      <body className="min-h-screen flex flex-col bg-navy antialiased">
        <Navbar />
        {/*
          Page content starts below the fixed navbar.
          Mobile:  pt-[64px]  (navbar only)
          Desktop: pt-[96px]  (contact strip 32px + navbar 64px)
        */}
        <main className="flex-1 pt-[64px] md:pt-[96px]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
