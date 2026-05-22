"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const WHATSAPP = "https://wa.me/254722777384?text=Hello%2C%20I%20would%20like%20to%20enquire%20about%20Horizon%20Hope%20Academy.";
const EMAIL    = "mailto:horizonhopeacademy.sc@gmail.com?subject=Enquiry — Horizon Hope Academy";

const schoolLinks = [
  { label: "About Us",        href: "/about"             },
  { label: "CBC Curriculum",  href: "/about#facilities"  },
  { label: "Our Programmes",  href: "/#programs"         },
  { label: "Why Choose Us",   href: "/#why"              },
];

const admissionLinks = [
  { label: "How to Enrol",    href: "/admissions"        },
  { label: "School Fees",     href: "/admissions"        },
  { label: "Visit the School",href: "/contact"           },
  { label: "FAQs",            href: "/faqs"              },
];

const quickLinks = [
  { label: "Home",            href: "/"                  },
  { label: "Contact Us",      href: "/contact"           },
  { label: "School Portal",   href: "/portal", external: false },
];

const socials = [
  { label: "wa", href: WHATSAPP, title: "WhatsApp", isWhatsApp: true },
];

export default function Footer() {
  return (
    <footer style={{ background: "#0a1228", borderTop: "0.5px solid rgba(100,130,210,0.1)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* ── Brand ── */}
        <div>
          <Link href="/" className="flex items-center gap-3 mb-4">
            <div className="relative flex-shrink-0" style={{ width: "40px", height: "40px" }}>
              <Image src="/assets/logo-footer.png" alt="Horizon Hope Academy" fill sizes="40px"
                className="object-contain" quality={100} />
            </div>
            <span className="font-serif font-semibold text-white leading-tight" style={{ fontSize: "1rem" }}>
              Horizon Hope<br />
              <span className="font-sans font-normal text-white/40 tracking-widest uppercase" style={{ fontSize: "0.55rem" }}>
                Academy · Shamata
              </span>
            </span>
          </Link>
          <p className="font-sans font-light leading-relaxed text-white/50 max-w-[240px] mb-5" style={{ fontSize: "0.8rem" }}>
            A caring private school in Shamata, Aberdares — committed service to excellence.
            Est. 1998 · Proudly reopened 2025.
          </p>
          <div className="space-y-2 mb-5">
            <a href="tel:+254722777384"
              className="flex items-center gap-2 font-sans text-white/50 hover:text-white transition-colors"
              style={{ fontSize: "0.78rem" }}>
              📞 +254 722 777 384
            </a>
            <a href="tel:+254752777384"
              className="flex items-center gap-2 font-sans text-white/50 hover:text-white transition-colors"
              style={{ fontSize: "0.78rem" }}>
              📞 +254 752 777 384
            </a>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 font-sans text-green-400/70 hover:text-green-400 transition-colors"
              style={{ fontSize: "0.78rem" }}>
              💬 WhatsApp Us
            </a>
            <a href={EMAIL}
              className="flex items-center gap-2 font-sans text-white/50 hover:text-gold-light transition-colors"
              style={{ fontSize: "0.78rem" }}>
              ✉️ horizonhopeacademy.sc@gmail.com
            </a>
            <div className="font-sans text-white/50" style={{ fontSize: "0.78rem" }}>
              📍 Shamata, Nyandarua County, Kenya
            </div>
          </div>
          <div className="flex gap-2">
            {socials.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" title={s.title}
                className={`w-8 h-8 rounded-full border flex items-center justify-center text-[0.65rem] font-bold transition-all ${
                  s.isWhatsApp
                    ? "border-green-500/30 text-green-400/60 hover:border-green-500 hover:text-green-400 hover:bg-green-500/10"
                    : "border-white/10 text-white/40 hover:border-gold hover:text-gold hover:bg-gold/[0.07]"
                }`}>
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {/* ── School links ── */}
        <div>
          <h4 className="text-white font-bold tracking-[0.15em] uppercase mb-4 font-sans" style={{ fontSize: "0.64rem" }}>School</h4>
          <ul className="space-y-2">
            {schoolLinks.map(l => (
              <li key={l.label}>
                <Link href={l.href} className="font-sans text-white/50 hover:text-white transition-colors flex items-center gap-1.5" style={{ fontSize: "0.8rem" }}>
                  <span className="text-gold text-xs">›</span>{l.label}
                </Link>
              </li>
            ))}
          </ul>
          <h4 className="text-white font-bold tracking-[0.15em] uppercase mb-4 mt-8 font-sans" style={{ fontSize: "0.64rem" }}>Quick Links</h4>
          <ul className="space-y-2">
            {quickLinks.map(l => (
              <li key={l.label}>
                {l.external ? (
                  <a href={l.href} target="_blank" rel="noopener noreferrer"
                    className="font-sans text-white/50 hover:text-white transition-colors flex items-center gap-1.5"
                    style={{ fontSize: "0.8rem" }}>
                    <span className="text-gold text-xs">›</span>{l.label}
                  </a>
                ) : (
                  <Link href={l.href} className="font-sans text-white/50 hover:text-white transition-colors flex items-center gap-1.5" style={{ fontSize: "0.8rem" }}>
                    <span className="text-gold text-xs">›</span>{l.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* ── Admissions links ── */}
        <div>
          <h4 className="text-white font-bold tracking-[0.15em] uppercase mb-4 font-sans" style={{ fontSize: "0.64rem" }}>Admissions</h4>
          <ul className="space-y-2">
            {admissionLinks.map(l => (
              <li key={l.label}>
                <Link href={l.href} className="font-sans text-white/50 hover:text-white transition-colors flex items-center gap-1.5" style={{ fontSize: "0.8rem" }}>
                  <span className="text-gold text-xs">›</span>{l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Newsletter ── */}
        <div>
          <h4 className="text-white font-bold tracking-[0.15em] uppercase mb-4 font-sans" style={{ fontSize: "0.64rem" }}>Newsletter</h4>
          <p className="font-sans font-light text-white/50 leading-relaxed mb-3" style={{ fontSize: "0.78rem" }}>
            Get our termly newsletter — events, results and school news delivered to your inbox.
          </p>
          <NewsletterForm />

          <div className="p-4 rounded-2xl border border-gold/15" style={{ background: "rgba(196,146,42,0.06)" }}>
            <p className="font-sans font-semibold text-white mb-1" style={{ fontSize: "0.8rem" }}>📋 School Portal</p>
            <p className="font-sans text-white/45 mb-3" style={{ fontSize: "0.74rem" }}>
              Admin, teachers, parents and students — access your account here.
            </p>
            <a href="/portal"
              className="inline-flex items-center gap-1.5 font-sans font-semibold text-gold-light hover:text-gold transition-colors"
              style={{ fontSize: "0.78rem" }}>
              Access Portal →
            </a>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t px-4 sm:px-6 lg:px-10 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 font-sans"
        style={{ borderColor: "rgba(100,130,210,0.08)", fontSize: "0.71rem", color: "rgba(168,184,216,0.4)" }}>
        <span>© {new Date().getFullYear()} Horizon Hope Academy, Shamata, Nyandarua County, Kenya. All rights reserved.</span>
        <div className="flex gap-5">
          <Link href="/faqs"    className="hover:text-white transition-colors">FAQs</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link>
        </div>
      </div>
    </footer>
  );
}
