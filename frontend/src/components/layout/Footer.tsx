import Image from "next/image";
import Link from "next/link";

const WHATSAPP = "https://wa.me/254700000000?text=Hello%2C%20I%20would%20like%20to%20enquire%20about%20Horizon%20Hope%20Academy.";
const EMAIL    = "mailto:info@horizonhopeacademy.sc.ke?subject=Enquiry%20—%20Horizon%20Hope%20Academy";

const schoolLinks     = ["About Us","Our Teachers","CBC Curriculum","School Calendar","School Rules"];
const admissionLinks  = ["How to Enrol","School Fees","Term Dates","Visit the School","FAQs"];

const socials = [
  { label: "fb", href: "https://facebook.com", title: "Facebook" },
  {
    label: "wa",
    href: WHATSAPP,
    title: "WhatsApp",
    isWhatsApp: true,
  },
  { label: "yt", href: "https://youtube.com", title: "YouTube" },
  { label: "𝕏",  href: "https://x.com",       title: "X / Twitter" },
];

export default function Footer() {
  return (
    <footer style={{ background: "#0a1228", borderTop: "0.5px solid rgba(100,130,210,0.1)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand */}
        <div>
          <Link href="/" className="flex items-center gap-3 mb-4">
            <div className="relative flex-shrink-0" style={{ width: "40px", height: "40px" }}>
              <Image src="/assets/logo-navbar.png" alt="Horizon Hope Academy Schools" fill sizes="40px"
                className="object-contain" quality={100} />
            </div>
            <span className="font-serif font-semibold text-white leading-tight" style={{ fontSize: "1rem" }}>
              Horizon Hope<br />
              <span className="font-sans font-normal text-white/40 tracking-widest uppercase" style={{ fontSize: "0.55rem" }}>
                Academy Schools
              </span>
            </span>
          </Link>
          <p className="font-sans font-light leading-relaxed text-white/50 max-w-[240px] mb-5" style={{ fontSize: "0.8rem" }}>
            A caring private school in Shamata, Aberdares — committed service to excellence since 2009.
          </p>
          {/* Contact details — all linked */}
          <div className="space-y-2 mb-5">
            <a href="tel:+254700000000"
              className="flex items-center gap-2 font-sans text-white/50 hover:text-white transition-colors"
              style={{ fontSize: "0.78rem" }}>
              📞 +254 700 000 000
            </a>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 font-sans text-green-400/70 hover:text-green-400 transition-colors"
              style={{ fontSize: "0.78rem" }}>
              💬 WhatsApp Us
            </a>
            <a href={EMAIL}
              className="flex items-center gap-2 font-sans text-white/50 hover:text-gold-light transition-colors"
              style={{ fontSize: "0.78rem" }}>
              ✉️ info@horizonhopeacademy.sc.ke
            </a>
            <div className="flex items-start gap-2 font-sans text-white/50" style={{ fontSize: "0.78rem" }}>
              📍 Shamata, Nyandarua County, Kenya
            </div>
            <div className="flex items-start gap-2 font-sans text-white/50" style={{ fontSize: "0.78rem" }}>
              📮 P.O. Box 20304-4, Kaheho
            </div>
          </div>
          {/* Social buttons */}
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

        {/* School links */}
        <div>
          <h4 className="text-white font-bold tracking-[0.15em] uppercase mb-4 font-sans" style={{ fontSize: "0.64rem" }}>School</h4>
          <ul className="space-y-2">
            {schoolLinks.map(l => (
              <li key={l}>
                <Link href="#" className="font-sans text-white/50 hover:text-white transition-colors flex items-center gap-1.5" style={{ fontSize: "0.8rem" }}>
                  <span className="text-gold text-xs">›</span>{l}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Admissions links */}
        <div>
          <h4 className="text-white font-bold tracking-[0.15em] uppercase mb-4 font-sans" style={{ fontSize: "0.64rem" }}>Admissions</h4>
          <ul className="space-y-2">
            {admissionLinks.map(l => (
              <li key={l}>
                <Link href="/admissions" className="font-sans text-white/50 hover:text-white transition-colors flex items-center gap-1.5" style={{ fontSize: "0.8rem" }}>
                  <span className="text-gold text-xs">›</span>{l}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-white font-bold tracking-[0.15em] uppercase mb-4 font-sans" style={{ fontSize: "0.64rem" }}>Newsletter</h4>
          <p className="font-sans font-light text-white/50 leading-relaxed mb-3" style={{ fontSize: "0.78rem" }}>
            Get our termly newsletter — events, results and school news.
          </p>
          <div className="flex">
            <input type="email" placeholder="your@email.com"
              className="flex-1 min-w-0 px-3 py-2 font-sans rounded-l-full text-white placeholder:text-white/25 outline-none focus:border-gold/40 transition-colors"
              style={{ fontSize: "0.78rem", background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(100,130,210,0.2)", borderRight: "none" }} />
            <button
              className="px-4 py-2 font-bold rounded-r-full hover:bg-gold-light transition-colors whitespace-nowrap font-sans"
              style={{ background: "#c4922a", color: "#0d1b45", fontSize: "0.75rem" }}>
              Join
            </button>
          </div>
          <p className="font-sans text-white/30 mt-2" style={{ fontSize: "0.62rem" }}>For parents & guardians only.</p>
          {/* Quick contact CTA */}
          <div className="mt-6 p-4 rounded-2xl border border-gold/15" style={{ background: "rgba(196,146,42,0.06)" }}>
            <p className="font-sans font-semibold text-white mb-2" style={{ fontSize: "0.8rem" }}>Have a question?</p>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-sans font-semibold text-green-400 hover:text-green-300 transition-colors"
              style={{ fontSize: "0.78rem" }}>
              💬 Chat on WhatsApp →
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t px-4 sm:px-6 lg:px-10 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 font-sans"
        style={{ borderColor: "rgba(100,130,210,0.08)", fontSize: "0.71rem", color: "rgba(168,184,216,0.4)" }}>
        <span>© 2025 Horizon Hope Academy Schools, Shamata, Nyandarua County, Kenya. All rights reserved.</span>
        <div className="flex gap-5">
          <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-white transition-colors">Terms</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link>
        </div>
      </div>
    </footer>
  );
}
