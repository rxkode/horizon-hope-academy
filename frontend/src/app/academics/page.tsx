"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import SectionLabel from "@/components/ui/SectionLabel";
import Button from "@/components/ui/Button";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] },
});

const levels = [
  {
    id: "foundation",
    icon: "🌱",
    level: "Foundation Class",
    ages: "Ages 3–4",
    grades: "Pre-PP1",
    color: "border-green-400/25 bg-green-400/[0.04]",
    badge: "bg-green-400/10 border-green-400/25 text-green-300",
    desc: "Our Foundation Class provides the earliest learners with a nurturing, play-based environment that builds social skills, language, and early numeracy in preparation for the formal CBC curriculum.",
    subjects: ["Language & Communication", "Creative Arts & Play", "Environmental Activities", "Music & Movement", "Early Numeracy"],
    highlights: ["Small group sizes", "Play-based learning", "Outdoor exploration", "Daily routines & structure"],
  },
  {
    id: "preprimary",
    icon: "🎨",
    level: "Pre-Primary",
    ages: "Ages 4–6",
    grades: "PP1 & PP2",
    color: "border-yellow-400/25 bg-yellow-400/[0.04]",
    badge: "bg-yellow-400/10 border-yellow-400/25 text-yellow-300",
    desc: "PP1 and PP2 follow the CBC Pre-Primary curriculum, focusing on developing language, mathematical, creative, and social foundations. Learners are introduced to structured learning through play, storytelling, art, and exploration.",
    subjects: ["Language Activities", "Mathematical Activities", "Environmental Activities", "Creative Activities", "Psychomotor & Creative Arts"],
    highlights: ["CBC-aligned curriculum", "Bilingual approach (English & Kiswahili)", "Physical development", "School readiness"],
  },
  {
    id: "lowerprimary",
    icon: "📖",
    level: "Lower Primary",
    ages: "Ages 6–9",
    grades: "Grade 1 – Grade 3",
    color: "border-blue-400/25 bg-blue-400/[0.04]",
    badge: "bg-blue-400/10 border-blue-400/25 text-blue-300",
    desc: "Lower Primary builds strong literacy and numeracy foundations under the CBC framework. Learners explore the world around them through integrated learning areas that connect classroom knowledge to real-life experience.",
    subjects: ["Literacy Activities", "Kiswahili Language Activities", "Mathematical Activities", "Environmental Activities", "Creative Arts", "Religious Education", "Movement & Creative Arts"],
    highlights: ["Continuous Assessment (CATs)", "Portfolio-based learning", "Home Science introduction", "Agriculture Activities"],
  },
  {
    id: "upperprimary",
    icon: "🔬",
    level: "Upper Primary",
    ages: "Ages 9–12",
    grades: "Grade 4 – Grade 6",
    color: "border-purple-400/25 bg-purple-400/[0.04]",
    badge: "bg-purple-400/10 border-purple-400/25 text-purple-300",
    desc: "Upper Primary deepens subject knowledge across all CBC learning areas while introducing more specialised topics. Learners develop critical thinking, digital literacy, and begin structured assessment preparation.",
    subjects: ["English", "Kiswahili", "Mathematics", "Integrated Science", "Social Studies", "CRE / IRE", "Computer Science", "Agriculture", "Home Science", "Creative Arts & Sports"],
    highlights: ["KNEC School Based Assessment", "Computer & ICT Lab", "Agriculture practicals", "Inter-school sports"],
  },
  {
    id: "juniorschool",
    icon: "🎓",
    level: "Junior School",
    ages: "Ages 12–15",
    grades: "Grade 7 – Grade 9",
    color: "border-gold/25 bg-gold/[0.04]",
    badge: "bg-gold/10 border-gold/25 text-gold-light",
    desc: "Junior School (formerly known as Junior Secondary) prepares learners for the transition to Senior School. This is a critical stage where subject specialisation begins and CBC assessment becomes more formal and structured.",
    subjects: ["English", "Kiswahili", "Mathematics", "Integrated Science", "Social Studies", "CRE / IRE", "Pre-Technical Studies", "Computer Science", "Agriculture", "Home Science", "Creative Arts"],
    highlights: ["KPSEA preparation (end of Grade 6)", "Formal subject departments", "Career pathway introduction", "Leadership & prefect system"],
  },
];

export default function AcademicsPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-10 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0b1535 0%, #1c3178 50%, #0d1b45 100%)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "repeating-linear-gradient(-30deg,transparent,transparent 38px,rgba(100,130,210,0.04) 38px,rgba(100,130,210,0.04) 39px)" }} />
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div {...fadeUp()}>
            <SectionLabel center>Academics</SectionLabel>
            <h1 className="font-serif font-bold mb-4" style={{ fontSize: "clamp(2.2rem,4vw,3.5rem)" }}>
              Our Academic Programmes
            </h1>
            <p className="font-sans text-white/65 leading-relaxed max-w-2xl mx-auto mb-6"
              style={{ fontSize: "clamp(0.9rem,1.5vw,1.05rem)" }}>
              Horizon Hope Academy offers the full CBC curriculum from Foundation Class through Grade 9 —
              giving every learner a strong foundation for life, further education, and leadership.
            </p>
            {/* Quick jump links */}
            <div className="flex flex-wrap gap-2 justify-center">
              {levels.map(l => (
                <a key={l.id} href={`#${l.id}`}
                  className="px-4 py-1.5 rounded-full border border-white/15 text-white/55 font-sans text-[0.75rem] hover:border-gold/40 hover:text-white transition-all">
                  {l.level}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Level sections ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-10 bg-navy">
        <div className="max-w-5xl mx-auto space-y-12">
          {levels.map((level, i) => (
            <motion.div
              key={level.id}
              id={level.id}
              {...fadeUp(0.1)}
              className={`rounded-2xl border p-8 scroll-mt-28 ${level.color}`}
            >
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <span className="text-[2.5rem]">{level.icon}</span>
                  <div>
                    <span className={`inline-block px-3 py-0.5 rounded-full border text-[0.62rem] font-bold tracking-wider uppercase mb-1 ${level.badge}`}>
                      {level.grades}
                    </span>
                    <h2 className="font-serif font-bold text-[1.6rem] text-white">{level.level}</h2>
                    <p className="font-sans text-[0.78rem] text-white/45">{level.ages}</p>
                  </div>
                </div>
                <Link href="/admissions">
                  <Button variant="outline">Enrol Now →</Button>
                </Link>
              </div>

              {/* Description */}
              <p className="font-sans text-[0.88rem] text-white/65 leading-[1.85] mb-6">{level.desc}</p>

              {/* Subjects + Highlights */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-sans text-[0.7rem] font-bold tracking-[0.12em] uppercase text-white/40 mb-3">
                    Learning Areas
                  </h3>
                  <ul className="space-y-1.5">
                    {level.subjects.map(s => (
                      <li key={s} className="flex items-center gap-2 font-sans text-[0.82rem] text-white/65">
                        <span className="text-gold flex-shrink-0">›</span>{s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-sans text-[0.7rem] font-bold tracking-[0.12em] uppercase text-white/40 mb-3">
                    Key Highlights
                  </h3>
                  <ul className="space-y-1.5">
                    {level.highlights.map(h => (
                      <li key={h} className="flex items-center gap-2 font-sans text-[0.82rem] text-white/65">
                        <span className="text-gold flex-shrink-0">✓</span>{h}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-10 text-center"
        style={{ background: "linear-gradient(135deg, #1c3178 0%, #162660 100%)", borderTop: "0.5px solid rgba(255,255,255,0.08)" }}>
        <div className="max-w-xl mx-auto">
          <h2 className="font-serif font-bold mb-3" style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)" }}>
            Ready to Join Us?
          </h2>
          <p className="font-sans text-white/65 mb-8 leading-relaxed" style={{ fontSize: "0.92rem" }}>
            Enrolment is open across all levels. Visit us in Shamata or apply online.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/admissions"><Button variant="primary">Apply for Admission →</Button></Link>
            <Link href="/contact"><Button variant="outline">📍 Visit the School</Button></Link>
          </div>
        </div>
      </section>
    </>
  );
}
