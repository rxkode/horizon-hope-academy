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

const WA_URL = "https://wa.me/254722777384?text=Hello%2C%20I%20would%20like%20to%20know%20more%20about%20student%20life%20at%20Horizon%20Hope%20Academy.";

const sections = [
  {
    id: "guidance",
    icon: "🧭",
    title: "Guidance & Counselling",
    color: "border-blue-400/25 bg-blue-400/[0.04]",
    desc: "Every learner at Horizon Hope Academy has access to pastoral guidance and counselling support. Our trained staff provide a safe, confidential space for learners to discuss academic challenges, personal concerns, or social difficulties.",
    points: [
      "One-on-one counselling sessions",
      "Academic guidance and subject choice advice",
      "Peer conflict resolution",
      "Career awareness from Grade 7",
      "Family and guardian referral support",
      "Transition support (PP to Primary, Primary to Junior School)",
    ],
  },
  {
    id: "fieldtrips",
    icon: "🚌",
    title: "Field Trips & Educational Visits",
    color: "border-green-400/25 bg-green-400/[0.04]",
    desc: "Learning goes beyond the classroom. We organise termly educational visits that connect curriculum content to real-world experiences — from nature walks in the Aberdares to visits to institutions in Nyahururu and beyond.",
    points: [
      "Termly educational excursions",
      "Aberdare Range nature walks",
      "Agricultural research visits",
      "Science & technology centres",
      "Community service projects",
      "Cultural heritage site visits",
    ],
  },
  {
    id: "clubs",
    icon: "🎯",
    title: "Clubs & Societies",
    color: "border-gold/25 bg-gold/[0.04]",
    desc: "Our clubs give learners the opportunity to explore interests beyond the standard curriculum, develop leadership skills, and build lasting friendships with peers who share their passions.",
    points: [
      "Computer & ICT Club",
      "Agriculture & Environmental Club",
      "Drama & Debate Club",
      "Science & Innovation Club",
      "Home Science Club",
      "Reading & Creative Writing Club",
    ],
  },
  {
    id: "sports",
    icon: "⚽",
    title: "Sports & Athletics",
    color: "border-orange-400/25 bg-orange-400/[0.04]",
    desc: "Sport is central to life at Horizon Hope Academy. We participate in inter-school competitions at zone, sub-county and county levels. Our Taekwondo programme has produced disciplined, confident learners across all grades.",
    points: [
      "Football (boys & girls)",
      "Netball",
      "Athletics & cross-country",
      "Taekwondo (all grades)",
      "Volleyball",
      "Inter-school competitions",
    ],
  },
  {
    id: "pastoral",
    icon: "🙏",
    title: "Pastoral Care",
    color: "border-purple-400/25 bg-purple-400/[0.04]",
    desc: "We believe in nurturing the whole child — spiritual, emotional, social, and physical. Our pastoral care programme ensures every learner feels known, valued, and supported throughout their time at Horizon Hope Academy.",
    points: [
      "Morning devotions & assembly",
      "Christian Religious Education (CRE)",
      "Islamic Religious Education (IRE) available",
      "Character education programme",
      "Anti-bullying initiatives",
      "Parent-teacher engagement sessions",
    ],
  },
];

export default function StudentLifePage() {
  return (
    <>
      <section className="relative py-20 px-4 sm:px-6 lg:px-10 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0b1535 0%, #1c3178 50%, #0d1b45 100%)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "repeating-linear-gradient(-30deg,transparent,transparent 38px,rgba(100,130,210,0.04) 38px,rgba(100,130,210,0.04) 39px)" }} />
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div {...fadeUp()}>
            <SectionLabel center>Student Life</SectionLabel>
            <h1 className="font-serif font-bold mb-4" style={{ fontSize: "clamp(2.2rem,4vw,3.5rem)" }}>
              Life Beyond the Classroom
            </h1>
            <p className="font-sans text-white/65 leading-relaxed max-w-xl mx-auto mb-6"
              style={{ fontSize: "clamp(0.9rem,1.5vw,1.05rem)" }}>
              At Horizon Hope Academy, we develop the whole child — nurturing character, confidence,
              and community alongside academic excellence.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {sections.map(s => (
                <a key={s.id} href={`#${s.id}`}
                  className="px-4 py-1.5 rounded-full border border-white/15 text-white/55 font-sans text-[0.75rem] hover:border-gold/40 hover:text-white transition-all">
                  {s.title.split(" ")[0]}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-10 bg-navy">
        <div className="max-w-5xl mx-auto space-y-10">
          {sections.map((sec, i) => (
            <motion.div key={sec.id} id={sec.id} {...fadeUp(i * 0.08)}
              className={`rounded-2xl border p-8 scroll-mt-28 ${sec.color}`}>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-[2rem]">{sec.icon}</span>
                <h2 className="font-serif font-bold text-[1.4rem]">{sec.title}</h2>
              </div>
              <p className="font-sans text-[0.88rem] text-white/65 leading-[1.85] mb-5">{sec.desc}</p>
              <ul className="grid sm:grid-cols-2 gap-2">
                {sec.points.map(p => (
                  <li key={p} className="flex items-center gap-2 font-sans text-[0.82rem] text-white/65">
                    <span className="text-gold flex-shrink-0">✓</span>{p}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-10 text-center"
        style={{ background: "linear-gradient(135deg, #1c3178 0%, #162660 100%)", borderTop: "0.5px solid rgba(255,255,255,0.08)" }}>
        <div className="max-w-xl mx-auto">
          <h2 className="font-serif font-bold mb-3" style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)" }}>
            Want to Know More?
          </h2>
          <p className="font-sans text-white/65 mb-8" style={{ fontSize: "0.92rem" }}>
            Come and visit us in Shamata and see school life for yourself.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href={WA_URL} target="_blank" rel="noopener noreferrer">
              <Button variant="primary">💬 WhatsApp Us</Button>
            </a>
            <Link href="/contact"><Button variant="outline">📍 Visit the School</Button></Link>
          </div>
        </div>
      </section>
    </>
  );
}
