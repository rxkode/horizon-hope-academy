"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Mail, ChevronDown } from "lucide-react";

/* ── Constants ───────────────────────────────────────────── */
const WA_URL    = "https://wa.me/254722777384?text=Hello%2C%20I%20would%20like%20to%20enquire%20about%20Horizon%20Hope%20Academy.";
const EMAIL_URL = "mailto:horizonhopeacademy.sc@gmail.com?subject=Enquiry — Horizon Hope Academy";
const EMAIL     = "horizonhopeacademy.sc@gmail.com";
const PHONE     = "+254 722 777 384";

const STRIP_H = 32;
const NAV_H   = 64;

/* ── Nav structure ───────────────────────────────────────── */
type NavItem = {
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
};

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Academics",
    children: [
      { label: "Foundation Class",          href: "/academics#foundation"    },
      { label: "Pre-Primary (PP1 & PP2)",   href: "/academics#preprimary"   },
      { label: "Lower Primary (Gr 1–3)",    href: "/academics#lowerprimary" },
      { label: "Upper Primary (Gr 4–6)",    href: "/academics#upperprimary" },
      { label: "Junior School (Gr 7–9)",    href: "/academics#juniorschool" },
    ],
  },
  {
    label: "Admissions",
    children: [
      { label: "Admission Enquiry Form",    href: "/admissions#apply"       },
      { label: "Requirements",              href: "/admissions#requirements" },
      { label: "Term Dates",               href: "/admissions#termdates"   },
      { label: "FAQs",                     href: "/faqs"                   },
    ],
  },
  {
    label: "Student Life",
    children: [
      { label: "Guidance & Counselling",   href: "/student-life#guidance"   },
      { label: "Field Trips",              href: "/student-life#fieldtrips" },
      { label: "Clubs & Societies",        href: "/student-life#clubs"      },
      { label: "Sports & Athletics",       href: "/student-life#sports"     },
      { label: "Pastoral Care",            href: "/student-life#pastoral"   },
    ],
  },
  {
    label: "Portal",
    children: [
      { label: "👨‍💼 Staff Login",           href: "/portal/staff"           },
      { label: "👨‍👩‍👧 Parent Login",          href: "/portal/parent"          },
      { label: "🎓 Student Login",          href: "/portal/student"         },
    ],
  },
  {
    label: "Media",
    children: [
      { label: "📷 Gallery",               href: "/gallery"                 },
      { label: "🎬 Videos",                href: "/media/videos"            },
    ],
  },
  { label: "Careers",    href: "/careers"    },
  { label: "Contact Us", href: "/contact"    },
];

/* ── WhatsApp icon ───────────────────────────────────────── */
function WhatsAppIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.553 4.103 1.522 5.834L.057 23.57a.5.5 0 00.61.641l5.906-1.545A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.944 9.944 0 01-5.073-1.39l-.362-.215-3.754.983.999-3.649-.236-.376A9.944 9.944 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
    </svg>
  );
}

/* ── Dropdown item ───────────────────────────────────────── */
function DropdownMenu({ items, onClose }: { items: { label: string; href: string }[]; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="absolute top-full left-0 mt-2 min-w-[220px] rounded-2xl overflow-hidden z-[80]"
      style={{
        background: "rgba(4,9,22,0.98)",
        border: "0.5px solid rgba(196,146,42,0.2)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        backdropFilter: "blur(20px)",
      }}
    >
      {items.map((item, i) => (
        <Link key={i} href={item.href} onClick={onClose}
          className="flex items-center px-4 py-3 font-sans text-[0.8rem] text-white/65 hover:text-white hover:bg-white/[0.06] transition-all border-b border-white/[0.04] last:border-0">
          {item.label}
        </Link>
      ))}
    </motion.div>
  );
}

/* ── Nav link with optional dropdown ────────────────────── */
function NavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isActive = item.href
    ? pathname === item.href
    : item.children?.some(c => pathname.startsWith(c.href.split("#")[0]));

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!item.children) {
    return (
      <Link href={item.href!}
        className={[
          "font-sans text-[0.78rem] font-medium tracking-wide whitespace-nowrap",
          "pb-0.5 border-b-[1.5px] transition-all duration-200",
          isActive ? "text-white border-gold" : "text-white/55 border-transparent hover:text-white hover:border-gold/50",
        ].join(" ")}>
        {item.label}
      </Link>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={[
          "flex items-center gap-1 font-sans text-[0.78rem] font-medium tracking-wide whitespace-nowrap",
          "pb-0.5 border-b-[1.5px] transition-all duration-200",
          isActive ? "text-white border-gold" : "text-white/55 border-transparent hover:text-white hover:border-gold/50",
        ].join(" ")}>
        {item.label}
        <ChevronDown size={12} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && <DropdownMenu items={item.children} onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN NAVBAR
   ══════════════════════════════════════════════════════════ */
export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [openMobile, setOpenMobile] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => { setMenuOpen(false); setOpenMobile(null); }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navBg = scrolled ? "rgba(7,14,35,0.98)" : "rgba(7,14,35,0.85)";

  return (
    <>
      {/* ── Contact strip ── */}
      <div className="hidden md:flex fixed left-0 right-0 z-[60] items-center justify-end gap-6 px-6 lg:px-10"
        style={{ top: 0, height: STRIP_H, background: "rgba(4,9,22,0.98)", borderBottom: "0.5px solid rgba(196,146,42,0.15)" }}>
        <a href={WA_URL} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-green-400/80 hover:text-green-400 transition-colors text-[0.7rem] font-sans font-medium">
          <WhatsAppIcon size={12} />{PHONE}
        </a>
        <a href={EMAIL_URL}
          className="flex items-center gap-1.5 text-white/40 hover:text-gold-light transition-colors text-[0.7rem] font-sans font-medium">
          <Mail size={11} />{EMAIL}
        </a>
      </div>

      {/* ── Main navbar ── */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed left-0 right-0 z-50 transition-all duration-300 hha-main-nav"
        style={{ top: 0, background: navBg, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: scrolled ? "0.5px solid rgba(196,146,42,0.2)" : "0.5px solid rgba(255,255,255,0.07)" }}>

        <style>{`@media (min-width: 768px) { .hha-main-nav { top: ${STRIP_H}px !important; } }`}</style>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between" style={{ height: NAV_H }}>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group" aria-label="Horizon Hope Academy home">
            <div className="relative flex-shrink-0 transition-transform duration-300 group-hover:scale-105" style={{ width: 40, height: 40 }}>
              <Image src="/assets/logo-navbar.png" alt="Horizon Hope Academy" fill sizes="40px" className="object-contain" priority quality={100} />
            </div>
            <div className="flex flex-col leading-tight min-w-0">
              <span className="font-serif font-semibold text-white truncate" style={{ fontSize: "clamp(0.82rem,2vw,1.05rem)" }}>
                Horizon Hope Academy
              </span>
              <span className="font-sans font-medium text-white/40 tracking-[0.13em] uppercase hidden sm:block" style={{ fontSize: "0.52rem" }}>
                Shamata · Aberdares
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-6">
            {NAV_ITEMS.map(item => (
              <NavLink key={item.label} item={item} pathname={pathname} />
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
            <a href={WA_URL} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-sans text-[0.72rem] font-semibold px-3 py-2 rounded-full border border-green-500/40 text-green-400 hover:bg-green-500/10 transition-all whitespace-nowrap">
              <WhatsAppIcon size={12} /><span className="hidden xl:inline">WhatsApp</span>
            </a>
            <Link href="/admissions#apply"
              className="font-sans text-[0.74rem] font-semibold px-4 py-2 rounded-full border border-gold text-gold-light hover:bg-gold hover:text-navy transition-all duration-200 tracking-wide whitespace-nowrap">
              Enrol Now
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button className="lg:hidden flex items-center justify-center w-9 h-9 text-white/70 hover:text-white transition-colors flex-shrink-0"
            onClick={() => setMenuOpen(o => !o)} aria-label={menuOpen ? "Close menu" : "Open menu"}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* ── Mobile menu ── */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden overflow-hidden"
              style={{ background: "rgba(4,9,22,0.98)", borderTop: "0.5px solid rgba(196,146,42,0.12)" }}>
              <div className="px-4 pb-5 pt-2 max-h-[70vh] overflow-y-auto">
                {NAV_ITEMS.map(item => (
                  <div key={item.label}>
                    {!item.children ? (
                      <Link href={item.href!}
                        className="flex items-center py-3 font-sans text-[0.88rem] font-medium border-b border-white/[0.06] text-white/65 hover:text-white transition-colors">
                        {item.label}
                      </Link>
                    ) : (
                      <div>
                        <button onClick={() => setOpenMobile(o => o === item.label ? null : item.label)}
                          className="w-full flex items-center justify-between py-3 font-sans text-[0.88rem] font-medium border-b border-white/[0.06] text-white/65 hover:text-white transition-colors">
                          {item.label}
                          <ChevronDown size={14} className={`transition-transform ${openMobile === item.label ? "rotate-180" : ""}`} />
                        </button>
                        <AnimatePresence>
                          {openMobile === item.label && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden pl-4 bg-white/[0.02]">
                              {item.children.map(child => (
                                <Link key={child.href} href={child.href}
                                  className="flex items-center py-2.5 font-sans text-[0.82rem] text-white/50 hover:text-gold-light transition-colors border-b border-white/[0.04] last:border-0">
                                  {child.label}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                ))}
                <div className="flex gap-2 mt-4">
                  <a href={WA_URL} target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full border border-green-500/40 text-green-400 text-[0.82rem] font-semibold transition-all hover:bg-green-500/10">
                    <WhatsAppIcon size={14} /> WhatsApp
                  </a>
                  <Link href="/admissions#apply"
                    className="flex-1 flex items-center justify-center py-2.5 rounded-full border border-gold text-gold-light text-[0.82rem] font-semibold transition-all hover:bg-gold hover:text-navy">
                    Enrol Now
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
