"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import SectionLabel from "@/components/ui/SectionLabel";
import Button from "@/components/ui/Button";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] },
});

const values = [
  { icon: "🎯", title: "Our Vision",
    desc: "To be the leading centre of academic excellence and character formation in Nyandarua County — nurturing confident, compassionate, and competent learners who are prepared for every stage of life." },
  { icon: "🌱", title: "Our Mission",
    desc: "To provide a safe, inclusive, and stimulating learning environment where every child is known, valued, and inspired to achieve their personal best through the CBC curriculum and rich co-curricular activities." },
  { icon: "⭐", title: "Our Motto",
    desc: "Committed Service to Excellence — these words guide every decision we make, from how we teach in the classroom to how we engage with families and the wider Shamata community." },
  { icon: "🤝", title: "Our Values",
    desc: "Integrity, respect, diligence, inclusivity, and community. We believe that character is as important as academic achievement, and we work every day to develop both in equal measure." },
];

const facilities = [
  { icon: "🏫", name: "Modern Classrooms",       desc: "Well-lit, ventilated classrooms designed for CBC activity-based learning with a maximum of 25 learners per class." },
  { icon: "💻", name: "Computer Laboratory",      desc: "Fully equipped ICT lab providing digital literacy skills from an early age, preparing learners for a technology-driven world." },
  { icon: "📚", name: "Library & Reading Room",   desc: "A growing collection of CBC-aligned books, reference materials, and reading resources available to all learners." },
  { icon: "🍽️", name: "Dining Hall",              desc: "A clean, spacious dining facility serving nutritious meals. Proper nutrition is foundational to learning and concentration." },
  { icon: "🌾", name: "School Farm",              desc: "A hands-on agriculture farm where learners grow crops and learn sustainable farming — perfectly suited to our highland Aberdares setting." },
  { icon: "🚐", name: "School Transport",         desc: "A dedicated school van providing safe, reliable transport for learners across Shamata and the surrounding areas." },
  { icon: "🏃", name: "Sports Grounds",           desc: "Open grounds for football, netball, athletics, and Taekwondo — supporting physical development and inter-school competitions." },
  { icon: "🏠", name: "Home Science Room",        desc: "A dedicated space for practical home science lessons covering nutrition, household management, and life skills." },
];

const timeline = [
  { year: "1998", event: "Founded",         desc: "Horizon Hope Academy opens its doors in Shamata, beginning its journey of educational service to the community." },
  { year: "2015", event: "Temporary Pause", desc: "School operations temporarily suspended due to operational challenges." },
  { year: "2025", event: "Reopened",        desc: "Horizon Hope Academy proudly reopens with a renewed vision, a committed team, and full CBC curriculum from PP1 to Grade 9." },
  { year: "2025", event: "Growing Strong",  desc: "Enrolment growing steadily across all grades. New facilities added, transport launched, and community partnerships established." },
];

export default function AboutPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-10 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0b1535 0%, #1c3178 50%, #0d1b45 100%)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "repeating-linear-gradient(-30deg,transparent,transparent 38px,rgba(100,130,210,0.04) 38px,rgba(100,130,210,0.04) 39px)" }} />
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div {...fadeUp()}>
            <SectionLabel center>About Us</SectionLabel>
            <h1 className="font-serif font-bold mb-4" style={{ fontSize: "clamp(2.2rem,4vw,3.5rem)" }}>
              About Horizon Hope Academy
            </h1>
            <p className="font-sans text-white/65 leading-relaxed max-w-2xl mx-auto mb-8"
              style={{ fontSize: "clamp(0.9rem,1.5vw,1.05rem)" }}>
              A proud institution rooted in Shamata, Nyandarua County — at the foot of the beautiful Aberdare Ranges.
              Originally founded in 1998, we reopened in 2025 with a renewed commitment to excellence, community, and the CBC curriculum.
            </p>
            <Link href="/admissions"><Button variant="primary">Join Our School Family →</Button></Link>
          </motion.div>
        </div>
      </section>

      {/* ── Vision / Mission / Motto / Values ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-10 bg-navy">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-12">
            <SectionLabel center>What Drives Us</SectionLabel>
            <h2 className="font-serif font-bold" style={{ fontSize: "clamp(1.9rem,3.2vw,2.7rem)" }}>
              Vision, Mission & Values
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-5">
            {values.map((v, i) => (
              <motion.div key={v.title} {...fadeUp(i * 0.1)}
                className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-7 hover:border-gold/25 hover:bg-white/[0.07] transition-all">
                <span className="text-[1.8rem] mb-3 block">{v.icon}</span>
                <h3 className="font-serif text-[1.15rem] font-semibold mb-2 text-gold-light">{v.title}</h3>
                <p className="font-sans text-[0.85rem] text-white/65 leading-[1.85]">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Story / Timeline ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-10 bg-navy-mid">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-12">
            <SectionLabel center>Our Journey</SectionLabel>
            <h2 className="font-serif font-bold" style={{ fontSize: "clamp(1.9rem,3.2vw,2.7rem)" }}>
              Our Story
            </h2>
          </motion.div>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-gold/40 via-gold/20 to-transparent" />
            <div className="space-y-8 pl-16">
              {timeline.map((t, i) => (
                <motion.div key={i} {...fadeUp(i * 0.1)} className="relative">
                  <div className="absolute -left-10 top-1 w-8 h-8 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-gold" />
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 hover:border-gold/20 transition-all">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-serif text-[1.3rem] font-bold text-gold">{t.year}</span>
                      <span className="font-sans text-[0.7rem] font-bold tracking-[0.12em] uppercase text-white/40 px-2 py-0.5 rounded-full border border-white/10">{t.event}</span>
                    </div>
                    <p className="font-sans text-[0.85rem] text-white/65 leading-relaxed">{t.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Facilities ── */}
      <section id="facilities" className="py-20 px-4 sm:px-6 lg:px-10 bg-navy">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-12">
            <SectionLabel center>Our Campus</SectionLabel>
            <h2 className="font-serif font-bold mb-3" style={{ fontSize: "clamp(1.9rem,3.2vw,2.7rem)" }}>
              Facilities & Resources
            </h2>
            <p className="font-sans text-white/55 max-w-lg mx-auto" style={{ fontSize: "0.9rem" }}>
              Everything a child needs to learn, grow, and thrive — right here in Shamata.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {facilities.map((f, i) => (
              <motion.div key={f.name} {...fadeUp(i * 0.06)}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-center hover:border-gold/25 hover:-translate-y-1 hover:bg-white/[0.07] transition-all duration-300">
                <div className="text-[1.8rem] mb-3">{f.icon}</div>
                <h3 className="font-serif font-semibold text-[0.9rem] mb-1 leading-tight">{f.name}</h3>
                <p className="font-sans text-[0.72rem] text-white/50 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-10 text-center"
        style={{ background: "linear-gradient(135deg, #1c3178 0%, #162660 100%)", borderTop: "0.5px solid rgba(255,255,255,0.08)" }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif font-bold mb-3" style={{ fontSize: "clamp(1.7rem,3vw,2.4rem)" }}>
            Come and See for Yourself
          </h2>
          <p className="font-sans text-white/65 mb-8 leading-relaxed" style={{ fontSize: "0.92rem" }}>
            We warmly invite you to visit our campus in Shamata. Meet our teachers, see our facilities,
            and feel the Horizon Hope community firsthand.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/admissions"><Button variant="primary">Apply for Admission →</Button></Link>
            <Link href="/contact"><Button variant="outline">📍 Get Directions</Button></Link>
          </div>
        </div>
      </section>
    </>
  );
}
