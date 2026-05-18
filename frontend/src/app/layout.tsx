import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    template: "%s | Horizon Hope Academy Schools",
    default: "Horizon Hope Academy Schools — Shamata, Aberdares",
  },
  description: "A caring private school in Shamata, Nyandarua County, near the Aberdare Ranges. CBC curriculum PP1 to Grade 9. Committed service to excellence.",
  keywords: ["Horizon Hope Academy", "Shamata school", "Nyandarua school", "CBC school Kenya", "Aberdares school"],
  openGraph: {
    title: "Horizon Hope Academy Schools",
    description: "Committed Service to Excellence — Shamata, Nyandarua County, Kenya",
    images: ["/assets/logo-navbar.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        {/* Navbar sits fixed — pages handle their own top padding */}
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
