"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import SectionLabel from "@/components/ui/SectionLabel";
import Button from "@/components/ui/Button";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] },
});

const WA_URL = "https://wa.me/254722777384?text=Hello%2C%20I%20have%20a%20question%20about%20Horizon%20Hope%20Academy.";

const faqs = [
  {
    category: "Fees & Costs",
    icon: "💰",
    questions: [
      {
        q: "Are there any extra costs beyond the school fees?",
        a: "The school fee covers tuition and standard learning activities. Additional costs that parents should plan for include: the school uniform (available in Nyahururu town — contact the office for supplier details), lunch (our dining hall provides nutritious meals — ask the office for the current meal plan rate), school transport (our van covers Shamata and surrounding areas — contact us for route and cost details), and any approved learning materials or activity fees communicated at the start of each term. We are always transparent about costs and will never surprise families with unannounced charges.",
      },
      {
        q: "Does the school provide textbooks and stationery, or do we buy them ourselves?",
        a: "In line with the CBC curriculum guidelines, approved learning materials are provided or clearly listed at the start of each term. Parents receive a specific list of what is required so they can plan accordingly. We work hard to keep material costs reasonable and will always communicate changes in advance. For the exact current requirements, please contact the school office directly.",
      },
    ],
  },
  {
    category: "Daily Routines & Logistics",
    icon: "🕐",
    questions: [
      {
        q: "What does a typical school day look like — arrival, breaks, and dismissal?",
        a: "School gates open at 7:30 AM and learning begins at 8:00 AM. The school day runs through structured CBC learning blocks with a morning break and a lunch break in our dining hall. School dismisses at 5:00 PM Monday through Friday. Our school van operates on a set schedule — contact the office for the current pick-up and drop-off timetable for your area.",
      },
      {
        q: "What happens if I am late picking up my child in the evening?",
        a: "We understand that parents sometimes face unavoidable delays. If you are running late, please call us immediately on +254 722 777 384 or +254 752 777 384 so we can inform your child\'s class teacher. A member of staff will remain with your child in a safe, supervised area until you arrive. We ask all parents to save our numbers and communicate promptly — your child\'s safety is always our first priority.",
      },
      {
        q: "Does the school have transport? What areas does it cover?",
        a: "Yes — Horizon Hope Academy operates a dedicated school van providing safe, reliable transport for learners in Shamata and the surrounding areas. The van runs a fixed morning and afternoon route. Please contact the school office on +254 722 777 384 for current route details, pick-up points, and transport fees.",
      },
    ],
  },
  {
    category: "Safety & Well-being",
    icon: "🛡️",
    questions: [
      {
        q: "What is the school\'s policy on discipline and bullying?",
        a: "At Horizon Hope Academy, we maintain a firm but loving approach to discipline rooted in our core values of respect and integrity. Physical punishment is not used. Bullying of any kind — physical, verbal, or social — is taken extremely seriously. We have a clear reporting process: any incident is investigated promptly, parents of all involved children are notified, and appropriate corrective action is taken. We conduct regular character education sessions to build a culture where every learner feels safe and respected.",
      },
      {
        q: "How does the school handle medical emergencies or sudden illness?",
        a: "The school has trained first-aiders on site and a well-stocked first aid kit. In the event of illness or injury, parents are contacted immediately using the emergency numbers provided at enrolment — please ensure these are always up to date. For serious emergencies, we have a clear protocol for getting the child to the nearest medical facility while keeping parents informed every step of the way. We strongly encourage all parents to provide complete medical information including any known allergies or chronic conditions on the Medical Declaration Form at enrolment.",
      },
    ],
  },
  {
    category: "Curriculum & Extra-Curriculars",
    icon: "📚",
    questions: [
      {
        q: "How does the school support learners who are struggling academically?",
        a: "We believe every child can succeed with the right support. Our small class sizes of around 20 learners mean teachers know each child individually and can identify challenges early. Learners who need extra support receive personalised attention from their class teacher, and parents are contacted proactively — we do not wait until end-of-term reports to flag concerns. We track each learner\'s CBC portfolio and school-based assessments closely and work with families to put targeted support in place.",
      },
      {
        q: "What extra-curricular activities and clubs are available?",
        a: "We offer a rich and growing range of co-curricular activities including: Taekwondo (discipline and fitness), Football and Netball (inter-school competitions), School Choir and Music, Drama and Storytelling, Computer and ICT Club, Agriculture Club (hands-on farming on our school farm), and Home Science. Activities run within the school day and after school. Participation in at least one activity is strongly encouraged as part of CBC\'s holistic development framework — but we work with each family to find what fits best.",
      },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`rounded-2xl border transition-all duration-300 overflow-hidden ${open ? "border-gold/30 bg-white/[0.07]" : "border-white/10 bg-white/[0.04] hover:border-white/20"}`}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full text-left px-6 py-5 flex items-start justify-between gap-4"
      >
        <span className="font-serif text-[0.95rem] font-semibold text-white leading-snug">{q}</span>
        <span className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center text-[0.7rem] font-bold transition-all duration-300 ${open ? "border-gold text-gold rotate-45" : "border-white/20 text-white/40"}`}>
          +
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 border-t border-white/[0.06] pt-4">
              <p className="font-sans text-[0.85rem] text-white/65 leading-[1.85]">{a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQsPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-10 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0b1535 0%, #1c3178 50%, #0d1b45 100%)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "repeating-linear-gradient(-30deg,transparent,transparent 38px,rgba(100,130,210,0.04) 38px,rgba(100,130,210,0.04) 39px)" }} />
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div {...fadeUp()}>
            <SectionLabel center>FAQs</SectionLabel>
            <h1 className="font-serif font-bold mb-4" style={{ fontSize: "clamp(2.2rem,4vw,3.5rem)" }}>
              Frequently Asked Questions
            </h1>
            <p className="font-sans text-white/65 leading-relaxed max-w-xl mx-auto mb-8"
              style={{ fontSize: "clamp(0.9rem,1.5vw,1.05rem)" }}>
              Answers to the questions parents and guardians ask us most often.
              Can&apos;t find what you need? We&apos;re always happy to help directly.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a href={WA_URL} target="_blank" rel="noopener noreferrer">
                <Button variant="primary">💬 Ask on WhatsApp</Button>
              </a>
              <Link href="/contact"><Button variant="outline">Send Us a Message</Button></Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ sections ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-10 bg-navy">
        <div className="max-w-3xl mx-auto space-y-14">
          {faqs.map((cat, ci) => (
            <motion.div key={cat.category} {...fadeUp(ci * 0.1)}>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-[1.6rem]">{cat.icon}</span>
                <h2 className="font-serif font-bold text-[1.3rem] text-gold-light">{cat.category}</h2>
              </div>
              <div className="space-y-3">
                {cat.questions.map((item, qi) => (
                  <FAQItem key={qi} q={item.q} a={item.a} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Still have questions CTA ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-10 text-center"
        style={{ background: "linear-gradient(135deg, #1c3178 0%, #162660 100%)", borderTop: "0.5px solid rgba(255,255,255,0.08)" }}>
        <div className="max-w-xl mx-auto">
          <span className="text-[2.5rem] block mb-3">🤝</span>
          <h2 className="font-serif font-bold mb-3" style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)" }}>
            Still Have a Question?
          </h2>
          <p className="font-sans text-white/65 mb-8 leading-relaxed" style={{ fontSize: "0.92rem" }}>
            Our team is always happy to help. The fastest way to get an answer is via WhatsApp —
            or you are welcome to visit us in Shamata during school hours (Mon–Fri, 8AM–5PM).
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href={WA_URL} target="_blank" rel="noopener noreferrer">
              <Button variant="primary">💬 WhatsApp Us Now</Button>
            </a>
            <Link href="/contact"><Button variant="outline">📍 Visit or Contact Us</Button></Link>
          </div>
        </div>
      </section>
    </>
  );
}
