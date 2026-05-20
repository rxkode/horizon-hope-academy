"use client";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import SectionLabel from "@/components/ui/SectionLabel";
import Button from "@/components/ui/Button";
import { useState, useEffect } from "react";

/* ─── Hero slides ────────────────────────────────────────── */
const slides = [
  {
    badge: "Admissions Open — 2025 / 2026",
    title: ["A Great Place to", "Grow & Learn"],
    italic: 1,
    body: "Horizon Hope Academy Schools is the best place for your child. With a CBC curriculum and nurturing co-curricular activities, every learner can succeed inside and outside the classroom.",
    cta: { label: "Explore Admission →", href: "/admissions" },
    sec: { label: "Our Story", href: "/about" },
  },
  {
    badge: "CBC · Grade PP1 – Grade 9",
    title: ["Where Every Child", "is an Achiever"],
    italic: 1,
    body: "Build your child's future with us. Our programmes give every learner the skills, knowledge, and confidence to achieve more — in school and in life.",
    cta: { label: "View Programmes →", href: "/about#programs" },
    sec: { label: "Why Choose Us", href: "/about#why" },
  },
  {
    badge: "Shamata, Nyandarua County",
    title: ["Inspiration,", "Innovation & Discovery"],
    italic: 1,
    body: "Every great future starts with good education. Together, we give your child the knowledge, character, and curiosity to climb every step of life's journey.",
    cta: { label: "Enrol Your Child →", href: "/admissions" },
    sec: { label: "Contact Us", href: "/contact" },
  },
];

/* ─── Background gallery photos (placeholder gradients) ─── */
const bgScenes = [
  "linear-gradient(135deg, #0a1628 0%, #1a2d5a 40%, #0d3320 100%)",
  "linear-gradient(135deg, #1a0d2e 0%, #0d1b45 40%, #1a2800 100%)",
  "linear-gradient(135deg, #0d1b45 0%, #2a1a00 50%, #0a2010 100%)",
];

/* ─── Stats ──────────────────────────────────────────────── */
const stats = [
  { num: "80+",     label: "Learners Enrolled" },
  { num: "8+",      label: "Qualified Teachers" },
  { num: "PP1–G9",  label: "Grades Offered" },
  { num: "Est. 1998", label: "Reopened 2025" },
  { num: "100%",    label: "CBC Compliant" },
];

/* ─── Programmes ─────────────────────────────────────────── */
const programs = [
  { icon: "📖", name: "CBC Curriculum",         desc: "PP1 through Grade 9 — Kenya's 2-6-6-3 framework" },
  { icon: "💻", name: "Computer & Technology",  desc: "Digital literacy for today's world" },
  { icon: "🌱", name: "Agriculture",            desc: "Hands-on farming in our highland setting" },
  { icon: "🏠", name: "Home Science",           desc: "Life skills, nutrition, household management" },
  { icon: "🎨", name: "Music & Arts",           desc: "Choir, visual arts, creative expression" },
  { icon: "🥋", name: "Taekwondo",             desc: "Discipline and fitness through martial arts" },
  { icon: "⚽", name: "Sports & Athletics",     desc: "Football, netball, inter-school games" },
  { icon: "🎭", name: "Drama & Storytelling",   desc: "Confidence through theatre and debate" },
];

/* ─── Why choose us ──────────────────────────────────────── */
const whyUs = [
  { num: "01", icon: "📋", title: "Outstanding CBC Curriculum",   desc: "Our learners experience a rich, varied curriculum which unlocks their potential, ensures outstanding outcomes, and builds confident individuals ready for every stage of life." },
  { num: "02", icon: "🌍", title: "Inclusive Community",          desc: "A warm, diverse community with strong mutual respect. We welcome learners of all backgrounds, faiths, and denominations and celebrate every child equally." },
  { num: "03", icon: "🎯", title: "Individualised Learning",      desc: "Small classes of ~20 mean every child gets personal attention. Our teachers tailor lessons to meet each student's unique needs in a conducive environment." },
  { num: "04", icon: "🌱", title: "Holistic Growth",              desc: "We want every learner to be a successful student who enjoys learning, a confident individual who lives a fulfilling life, and a responsible citizen." },
];

/* ─── Testimonials ───────────────────────────────────────── */
const testimonials = [
  { initials: "WN", name: "Wanjiku Ngugi",    role: "Parent, Grade 4",        quote: "My daughter struggled in her previous school but here the teachers actually know her by name. Her confidence has grown so much in just one term." },
  { initials: "JK", name: "Joseph Kamau",     role: "Parent, Grade 6",        quote: "Horizon Hope is the best thing that happened to our family. The school is strict in a loving way — our son is disciplined, focused, and very happy." },
  { initials: "AN", name: "Akinyi Ndirangu",  role: "Former pupil, KCPE 2023", quote: "I joined in Grade 7 and the teachers helped me so much. I scored 358 in KCPE. Now I am at Nyandarua High — Horizon Hope prepared me very well." },
  { initials: "PM", name: "Peris Muthoni",    role: "Parent, PP2 & Grade 2",  quote: "The school feels like a community. Teachers, parents, and children all look out for one another. This is what education should feel like everywhere." },
  { initials: "DW", name: "David Wachira",    role: "Parent, twin learners",  quote: "As a farmer here in Shamata, I was unsure about fees — but the school worked with us. My twins are thriving and I have absolutely no regrets." },
  { initials: "GC", name: "Grace Chege",      role: "Parent, Grade 5 & 7",   quote: "Special appreciation to all the class teachers — you are a wonderful team. God bless the teachers, management and the whole Horizon Hope family. 🙏" },
];

/* ─── Animation helper ───────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] },
});

/* ─── Bento card ─────────────────────────────────────────── */
function BentoCard({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-md p-4 hover:border-gold/40 hover:bg-white/[0.09] transition-all duration-300 ${className}`}>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent" />
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
export default function HomePage() {
  const [slide, setSlide]     = useState(0);
  const [bgSlide, setBgSlide] = useState(0);

  /* Hero text carousel */
  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % slides.length), 5500);
    return () => clearInterval(t);
  }, []);

  /* Background scene carousel — slower */
  useEffect(() => {
    const t = setInterval(() => setBgSlide(s => (s + 1) % bgScenes.length), 8000);
    return () => clearInterval(t);
  }, []);

  const s = slides[slide];

  return (
    <>
      {/* ════════════════════════════════════════════════════
          HERO — full-screen with animated background + bento
          ════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center pt-[68px] overflow-hidden">

        {/* ── Animated background scenes ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={bgSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
            className="absolute inset-0 z-0"
            style={{ background: bgScenes[bgSlide] }}
          />
        </AnimatePresence>

        {/* Topographic grid overlay */}
        <div className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            backgroundImage: "repeating-linear-gradient(-30deg,transparent,transparent 38px,rgba(100,130,210,0.04) 38px,rgba(100,130,210,0.04) 39px)",
          }}
        />

        {/* Subtle radial glow */}
        <div className="absolute inset-0 z-[1] pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 70% at 70% 50%, rgba(196,146,42,0.07) 0%, transparent 65%)" }}
        />

        {/* ── CONTENT GRID ── */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 w-full grid lg:grid-cols-2 gap-8 lg:gap-14 items-center py-10 lg:py-16">

          {/* LEFT — slide text */}
          <div className="order-1 lg:order-1">
            <p className="font-sans text-[0.67rem] tracking-[0.14em] text-white/50 mb-3 font-medium">
              {String(slide + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
            </p>

            <AnimatePresence mode="wait">
              <motion.div
                key={slide}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Badge */}
                <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full border border-gold/40 bg-gold/[0.08] backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-light animate-pulse" />
                  <span className="text-gold-light text-[0.67rem] font-bold tracking-[0.1em] uppercase font-sans">{s.badge}</span>
                </div>

                {/* Title */}
                <h1 className="font-serif font-bold leading-[1.1] tracking-tight mb-4"
                  style={{ fontSize: "clamp(2.4rem, 4.4vw, 4rem)" }}>
                  {s.title.map((line, i) => (
                    <span key={i} className={i === s.italic ? "block italic text-gold-light" : "block text-white"}>
                      {line}
                    </span>
                  ))}
                </h1>

                {/* Location pill */}
                <p className="font-sans text-[0.76rem] text-white/60 mb-4 flex items-center gap-1.5">
                  📍 Shamata, Nyandarua County, Kenya
                </p>

                {/* Body */}
                <p className="font-sans font-light leading-[1.85] max-w-[430px] mb-7 text-white/75"
                  style={{ fontSize: "clamp(0.85rem, 1.5vw, 0.92rem)" }}>
                  {s.body}
                </p>

                {/* CTA buttons */}
                <div className="flex items-center gap-3 mb-7 flex-wrap">
                  <Link href={s.cta.href}><Button variant="primary">{s.cta.label}</Button></Link>
                  <Link href={s.sec.href}><Button variant="outline">{s.sec.label}</Button></Link>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slide dots */}
            <div className="flex gap-2">
              {slides.map((_, i) => (
                <button key={i} onClick={() => setSlide(i)}
                  className={`h-[3px] rounded-full transition-all duration-300 ${i === slide ? "w-9 bg-gold" : "w-6 bg-white/20 hover:bg-white/40"}`}
                />
              ))}
            </div>
          </div>

          {/* RIGHT — HQ logo + bento grid below on mobile, side on desktop */}
          <div className="order-2 lg:order-2 flex flex-col items-center gap-5">

            {/* Official seal — HQ PNG, crisp rendering */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
              style={{ width: "clamp(180px, 28vw, 300px)", height: "clamp(180px, 28vw, 300px)" }}
            >
              <Image
                src="/assets/logo-hero.png"
                alt="Horizon Hope Academy Schools Official Seal"
                fill
                sizes="(max-width: 768px) 200px, (max-width: 1200px) 260px, 300px"
                className="object-contain"
                priority
                quality={100}
                style={{ filter: "drop-shadow(0 16px 48px rgba(196,146,42,0.30))" }}
              />
            </motion.div>

            {/* ── BENTO GRID ── */}
            <div className="w-full grid grid-cols-2 gap-2.5" style={{ maxWidth: "420px" }}>

              {/* School Motto */}
              <BentoCard className="bg-gold/[0.1] border-gold/30">
                <span className="text-xl mb-1 block">⭐</span>
                <div className="text-[0.6rem] font-bold tracking-[0.12em] uppercase text-white/50 mb-0.5">Our Motto</div>
                <div className="font-serif text-[1rem] font-bold text-white leading-tight">Committed Service</div>
                <div className="font-serif text-[1rem] font-bold text-gold-light leading-tight">to Excellence</div>
                <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full bg-gold/15 border border-gold/30 text-gold-light text-[0.58rem] font-bold tracking-wider">
                  CBC · PP1 – Grade 9
                </span>
              </BentoCard>

              {/* Class size */}
              <BentoCard>
                <span className="text-xl mb-1 block">🧑‍🏫</span>
                <div className="text-[0.6rem] font-bold tracking-[0.12em] uppercase text-white/50 mb-0.5">Class Size</div>
                <div className="font-serif text-[1.65rem] font-bold text-white leading-none">~20</div>
                <div className="text-[0.62rem] text-white/50 mt-1">Personal attention guaranteed</div>
                <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full bg-white/10 border border-white/15 text-white/70 text-[0.58rem] font-bold tracking-wider">
                  Small classes
                </span>
              </BentoCard>

              {/* Term performance — spans full width */}
              <BentoCard className="col-span-2">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-[0.6rem] font-bold tracking-[0.12em] uppercase text-white/50 mb-0.5">Term Performance</div>
                    <div className="font-serif text-[1.1rem] font-semibold text-white">Consistently Rising</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/15 text-white/70 text-[0.58rem] font-bold">↑ Trend</span>
                </div>
                {/* Mini bar chart */}
                <div className="flex items-end gap-1 h-9">
                  {[48,58,54,66,72,86,100].map((h, i) => (
                    <div key={i}
                      className={`flex-1 rounded-t-sm transition-all ${i >= 5 ? "bg-gold/70" : "bg-white/20"}`}
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </BentoCard>

              {/* Upcoming events */}
              <BentoCard>
                <div className="text-[0.6rem] font-bold tracking-[0.12em] uppercase text-white/50 mb-2">Upcoming</div>
                <div className="space-y-1.5">
                  {[
                    { dot: "bg-gold", text: "Sports Day — July 12" },
                    { dot: "bg-green-400", text: "Open Day — Aug 3" },
                    { dot: "bg-gold", text: "Term 3 — Sept 2" },
                  ].map(e => (
                    <div key={e.text} className="flex items-center gap-2 text-[0.68rem] text-white/75 border-b border-white/[0.06] pb-1 last:border-0 last:pb-0">
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${e.dot}`} />
                      {e.text}
                    </div>
                  ))}
                </div>
              </BentoCard>

              {/* Attendance */}
              <BentoCard>
                <span className="text-xl mb-1 block">✅</span>
                <div className="text-[0.6rem] font-bold tracking-[0.12em] uppercase text-white/50 mb-0.5">Attendance</div>
                <div className="font-serif text-[1.65rem] font-bold text-white leading-none">94%</div>
                <div className="text-[0.62rem] text-white/50 mt-1">Daily average, 2024</div>
                <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full bg-white/10 border border-white/15 text-white/70 text-[0.58rem] font-bold tracking-wider">
                  Excellent
                </span>
              </BentoCard>

            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          STATS BAR
          ════════════════════════════════════ */}
      <div className="bg-navy-mid border-y border-white/[0.06] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex flex-wrap items-center justify-around gap-6">
          {stats.map((st, i) => (
            <motion.div key={st.label} {...fadeUp(i * 0.08)} className="text-center">
              <span className="block font-serif text-[2rem] font-bold text-white leading-none">{st.num}</span>
              <span className="block font-sans text-[0.63rem] text-white/50 font-medium tracking-[0.09em] uppercase mt-1">{st.label}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════
          PROGRAMMES
          ════════════════════════════════════ */}
      <section id="programs" className="py-20 px-4 sm:px-6 lg:px-10 bg-navy">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-12">
            <SectionLabel center>Our Programmes</SectionLabel>
            <h2 className="font-serif font-bold mb-3" style={{ fontSize: "clamp(2rem,3.5vw,2.9rem)" }}>
              Our Featured Programmes
            </h2>
            <p className="font-sans font-light leading-relaxed text-white/60 max-w-lg mx-auto" style={{ fontSize: "0.91rem" }}>
              Carefully selected and uniquely delivered every term — giving every learner a rich, rounded education.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {programs.map((p, i) => (
              <motion.div key={p.name} {...fadeUp(i * 0.06)}
                className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-5 lg:p-6 text-center group cursor-pointer hover:border-gold/30 hover:-translate-y-1 hover:bg-white/[0.07] transition-all duration-300"
              >
                <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-[14px] bg-gold/[0.08] border border-gold/20 flex items-center justify-center text-[1.3rem] lg:text-[1.5rem] mx-auto mb-3 lg:mb-4 group-hover:bg-gold/[0.16] group-hover:border-gold/40 transition-all">
                  {p.icon}
                </div>
                <h3 className="font-serif font-semibold mb-1 leading-tight" style={{ fontSize: "clamp(0.85rem,1.5vw,0.98rem)" }}>{p.name}</h3>
                <p className="font-sans text-[0.71rem] text-white/55 leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          WHY CHOOSE US
          ════════════════════════════════════ */}
      <section id="why" className="py-20 px-4 sm:px-6 lg:px-10 bg-navy-mid">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-12">
            <SectionLabel center>Why Choose Us?</SectionLabel>
            <h2 className="font-serif font-bold" style={{ fontSize: "clamp(2rem,3.5vw,2.9rem)" }}>
              Why Should You Choose<br />Horizon Hope Academy?
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-5">
            {whyUs.map((w, i) => (
              <motion.div key={w.num} {...fadeUp(i * 0.1)}
                className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-7 lg:p-8 relative overflow-hidden hover:border-gold/25 hover:bg-white/[0.07] transition-all"
              >
                <span className="absolute top-5 right-6 font-serif text-[2.4rem] font-bold text-gold/10 leading-none select-none">{w.num}</span>
                <span className="text-[1.4rem] mb-4 block">{w.icon}</span>
                <h3 className="font-serif text-[1.18rem] font-semibold mb-2">{w.title}</h3>
                <p className="font-sans text-[0.84rem] text-white/60 leading-[1.8]">{w.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          TESTIMONIALS
          ════════════════════════════════════ */}
      <section id="testimonials" className="py-20 bg-navy border-y border-white/[0.06] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 text-center mb-10">
          <SectionLabel center>What Families Say</SectionLabel>
          <h2 className="font-serif font-bold" style={{ fontSize: "clamp(1.8rem,3vw,2.6rem)" }}>
            Voices from Our School Family
          </h2>
        </div>
        <div className="relative overflow-hidden"
          style={{ maskImage: "linear-gradient(90deg,transparent,black 8%,black 92%,transparent)", WebkitMaskImage: "linear-gradient(90deg,transparent,black 8%,black 92%,transparent)" }}>
          <div className="flex gap-4 animate-marquee w-max hover:[animation-play-state:paused]">
            {[...testimonials, ...testimonials].map((t, i) => (
              <div key={i}
                className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-5 flex-shrink-0 hover:border-gold/25 transition-all"
                style={{ width: "290px" }}>
                <div className="text-[0.59rem] text-white/40 font-sans tracking-wider uppercase mb-2 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-sm bg-blue-600 text-white text-[0.65rem] font-bold flex items-center justify-center">f</span>
                  Facebook · Parent
                </div>
                <p className="font-serif text-[0.9rem] italic text-white/82 leading-[1.72] mb-4">
                  <span className="text-gold text-[1.4rem] leading-none align-[-0.28em] mr-0.5 not-italic">&ldquo;</span>
                  {t.quote}
                </p>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-navy-soft to-gold flex items-center justify-center text-[0.67rem] font-bold text-white flex-shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-[0.8rem] font-semibold text-white">{t.name}</div>
                    <div className="text-[0.64rem] text-white/50">{t.role}</div>
                    <div className="text-gold text-[0.62rem] tracking-wide">★★★★★</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          ADMISSIONS CTA
          ════════════════════════════════════ */}
      <section id="admissions-cta" className="py-20 px-4 sm:px-6 lg:px-10 text-center"
        style={{ background: "linear-gradient(135deg, #1c3178 0%, #162660 100%)", borderTop: "0.5px solid rgba(255,255,255,0.08)", borderBottom: "0.5px solid rgba(255,255,255,0.08)" }}>
        <div className="max-w-4xl mx-auto">
          <SectionLabel center>Admissions</SectionLabel>
          <h2 className="font-serif font-bold mb-4" style={{ fontSize: "clamp(2rem,3.5vw,2.9rem)" }}>
            Join Our School Family
          </h2>
          <p className="font-sans font-light text-white/70 leading-[1.82] mb-10 max-w-xl mx-auto" style={{ fontSize: "0.92rem" }}>
            Enrolment is open for 2025/2026 across all grades PP1 to Grade 9. We welcome learners of all backgrounds. Visit us in Shamata or apply online.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 mb-10 text-left">
            {[
              { step: "Step 01", title: "Visit the School",    desc: "Come and see our campus in Shamata. Meet our teachers and feel the Horizon Hope community." },
              { step: "Step 02", title: "Submit Application",  desc: "Collect an enrolment form. Bring your child's birth certificate, previous reports, and two passport photos." },
              { step: "Step 03", title: "Begin the Journey",   desc: "Once confirmed and fees are arranged, your child is welcomed into our school family — ready to thrive." },
            ].map(a => (
              <div key={a.step} className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 hover:border-gold/25 transition-all">
                <div className="text-gold font-bold font-sans text-[0.59rem] tracking-[0.14em] uppercase mb-2">{a.step}</div>
                <h3 className="font-serif text-[1rem] font-semibold mb-2">{a.title}</h3>
                <p className="font-sans text-[0.78rem] text-white/60 leading-[1.68]">{a.desc}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/admissions"><Button variant="primary">Apply Now →</Button></Link>
            <Link href="/contact"><Button variant="outline">📞 Call Us Now</Button></Link>
          </div>
        </div>
      </section>
    </>
  );
}
