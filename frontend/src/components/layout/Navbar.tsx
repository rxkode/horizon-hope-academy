"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, Mail } from "lucide-react";

const WHATSAPP_NUMBER = "254700000000";
const WHATSAPP_URL    = `https://wa.me/${WHATSAPP_NUMBER}?text=Hello%2C%20I%20would%20like%20to%20enquire%20about%20Horizon%20Hope%20Academy.`;
const EMAIL           = "info@horizonhopeacademy.sc.ke";
const EMAIL_URL       = `mailto:${EMAIL}?subject=Enquiry%20—%20Horizon%20Hope%20Academy`;

const links = [
  { href: "/",           label: "Home" },
  { href: "/about",      label: "About" },
  { href: "/admissions", label: "Admission" },
  { href: "/contact",    label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 55);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Top contact strip */}
      <div className="fixed top-0 left-0 right-0 z-[60] hidden md:flex items-center justify-end gap-6 px-6 lg:px-10 py-1.5 text-[0.7rem] font-sans"
        style={{ background: "rgba(7,14,35,0.95)", borderBottom: "0.5px solid rgba(100,130,210,0.15)" }}>
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-white/50 hover:text-green-400 transition-colors">
          {/* WhatsApp icon */}
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.553 4.103 1.522 5.834L.057 23.57a.5.5 0 00.61.641l5.906-1.545A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.944 9.944 0 01-5.073-1.39l-.362-.215-3.754.983.999-3.649-.236-.376A9.944 9.944 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
          </svg>
          +254 700 000 000
        </a>
        <a href={EMAIL_URL}
          className="flex items-center gap-1.5 text-white/50 hover:text-gold-light transition-colors">
          <Mail size={12} />
          {EMAIL}
        </a>
      </div>

      {/* Main navbar */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed left-0 right-0 z-50 transition-all duration-300"
        style={{
          top: "0",
          marginTop: "0",
          background: scrolled ? "rgba(7,14,35,0.97)" : "rgba(7,14,35,0.80)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: `0.5px solid ${scrolled ? "rgba(196,146,42,0.2)" : "rgba(255,255,255,0.08)"}`,
          boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.3)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-[64px] md:h-[68px] flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="relative flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
              style={{ width: "44px", height: "44px" }}>
              <Image
                src="/assets/logo-navbar.png"
                alt="Horizon Hope Academy Schools Official Seal"
                fill
                sizes="44px"
                className="object-contain"
                priority
                quality={100}
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-serif font-semibold text-white leading-[1.15]"
                style={{ fontSize: "clamp(0.9rem, 1.5vw, 1.05rem)" }}>
                Horizon Hope Academy
              </span>
              <span className="font-sans font-medium text-white/40 tracking-[0.14em] uppercase"
                style={{ fontSize: "0.55rem" }}>
                Shamata · Aberdares
              </span>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-7">
            {links.map(l => (
              <Link key={l.href} href={l.href}
                className={`font-sans text-[0.8rem] font-medium tracking-wide pb-0.5 border-b-[1.5px] transition-all duration-200 ${
                  pathname === l.href
                    ? "text-white border-gold"
                    : "text-white/55 border-transparent hover:text-white hover:border-gold/60"
                }`}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            {/* WhatsApp button — live link */}
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-sans text-[0.72rem] font-semibold px-4 py-2 rounded-full border border-green-500/50 text-green-400 hover:bg-green-500/10 transition-all">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.553 4.103 1.522 5.834L.057 23.57a.5.5 0 00.61.641l5.906-1.545A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.944 9.944 0 01-5.073-1.39l-.362-.215-3.754.983.999-3.649-.236-.376A9.944 9.944 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
              WhatsApp
            </a>
            <Link href="/admissions"
              className="font-sans text-[0.76rem] font-semibold px-5 py-2 rounded-full border border-gold text-gold-light hover:bg-gold hover:text-navy transition-all duration-200 tracking-wide">
              Enrol Now
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden text-white/60 hover:text-white p-1"
            onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{ background: "rgba(7,14,35,0.98)", borderTop: "0.5px solid rgba(196,146,42,0.1)" }}
              className="md:hidden px-4 pb-5"
            >
              {links.map(l => (
                <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                  className="block py-3.5 font-sans text-sm text-white/70 hover:text-white border-b border-white/[0.05] last:border-0">
                  {l.label}
                </Link>
              ))}
              <div className="flex gap-2 mt-4 flex-wrap">
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
                  className="flex-1 text-center py-2.5 rounded-full border border-green-500/50 text-green-400 text-sm font-semibold">
                  WhatsApp Us
                </a>
                <Link href="/admissions" onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center py-2.5 rounded-full border border-gold text-gold-light text-sm font-semibold">
                  Enrol Now
                </Link>
              </div>
              {/* Mobile contact quick links */}
              <div className="mt-4 pt-4 border-t border-white/[0.05] space-y-2">
                <a href={EMAIL_URL} className="flex items-center gap-2 text-xs text-white/40 hover:text-white/70">
                  <Mail size={12} /> {EMAIL}
                </a>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-white/40 hover:text-white/70">
                  <Phone size={12} /> +254 700 000 000
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
