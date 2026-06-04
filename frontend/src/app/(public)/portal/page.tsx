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

const WA_URL = "https://wa.me/254722777384?text=Hello%2C%20I%20need%20help%20accessing%20the%20school%20portal.";

// Update PORTAL_URL when the school gets a public domain/server
// For now points to local network — staff access on school premises
const PORTAL_URL = "https://horizon-hope-academy.vercel.app/admin";

const personas = [
  {
    icon: "👨‍💼",
    title: "School Administration",
    desc: "Manage student records, staff accounts, grades, attendance, scheduling, and all school operations.",
    color: "border-gold/30 bg-gold/[0.06]",
    badge: "Admin Access",
    badgeColor: "bg-gold/15 border-gold/30 text-gold-light",
    features: [
      "Student enrollment & records",
      "Staff management",
      "Grade & attendance reports",
      "CBC assessment tracking",
      "Financial records",
      "School calendar & scheduling",
    ],
  },
  {
    icon: "👩‍🏫",
    title: "Teachers",
    desc: "Mark attendance, enter grades, track CBC portfolio assessments, and communicate with parents.",
    color: "border-blue-400/20 bg-blue-400/[0.04]",
    badge: "Teacher Access",
    badgeColor: "bg-blue-400/10 border-blue-400/20 text-blue-300",
    features: [
      "Mark daily attendance",
      "Enter term grades",
      "CBC strand assessments",
      "Student progress notes",
      "Class timetable",
      "Parent communication log",
    ],
  },
  {
    icon: "👨‍👩‍👧",
    title: "Parents & Guardians",
    desc: "View your child's grades, attendance record, fee balance, and school communications.",
    color: "border-green-400/20 bg-green-400/[0.04]",
    badge: "Parent Access",
    badgeColor: "bg-green-400/10 border-green-400/20 text-green-300",
    features: [
      "Child's grades & reports",
      "Attendance record",
      "Fee balance & payments",
      "CBC assessment results",
      "School notices",
      "Download report cards",
    ],
  },
  {
    icon: "🎓",
    title: "Students",
    desc: "View your timetable, grades, CBC assessments, and school announcements.",
    color: "border-purple-400/20 bg-purple-400/[0.04]",
    badge: "Student Access",
    badgeColor: "bg-purple-400/10 border-purple-400/20 text-purple-300",
    features: [
      "View timetable",
      "Check grades",
      "CBC portfolio",
      "School notices",
      "Download results",
      "Academic calendar",
    ],
  },
];

const mpesaSteps = [
  { step: "1", text: "Open M-Pesa on your phone" },
  { step: "2", text: "Select Lipa na M-Pesa → Pay Bill" },
  { step: "3", text: "Business No: 506900 (Tower Sacco)" },
  { step: "4", text: "Account No: Your child's admission number" },
  { step: "5", text: "Enter amount → PIN → Send" },
  { step: "6", text: "You will receive an SMS confirmation" },
];

export default function PortalPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-10 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0b1535 0%, #1c3178 50%, #0d1b45 100%)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "repeating-linear-gradient(-30deg,transparent,transparent 38px,rgba(100,130,210,0.04) 38px,rgba(100,130,210,0.04) 39px)" }} />
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div {...fadeUp()}>
            <SectionLabel center>School Portal</SectionLabel>
            <h1 className="font-serif font-bold mb-4" style={{ fontSize: "clamp(2.2rem,4vw,3.5rem)" }}>
              Horizon Hope Academy Portal
            </h1>
            <p className="font-sans text-white/65 leading-relaxed max-w-xl mx-auto mb-8"
              style={{ fontSize: "clamp(0.9rem,1.5vw,1.05rem)" }}>
              Our school management system for administrators, teachers, parents and students.
              Access your account below or contact the school office for login credentials.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a href={PORTAL_URL} target="_blank" rel="noopener noreferrer">
                <Button variant="primary">🔐 Access Portal →</Button>
              </a>
              <a href={WA_URL} target="_blank" rel="noopener noreferrer">
                <Button variant="outline">💬 Need Help?</Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Portal notice ── */}
      <div className="bg-gold/[0.08] border-y border-gold/20 py-4 px-4 text-center">
        <p className="font-sans text-[0.85rem] text-white/70">
          🏫 <span className="text-gold-light font-semibold">Currently accessible on school premises.</span>
          {" "}Remote access coming soon. Contact the office for your login credentials.
        </p>
      </div>

      {/* ── Department cards ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-10 bg-navy">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-12">
            <SectionLabel center>Who Uses the Portal</SectionLabel>
            <h2 className="font-serif font-bold" style={{ fontSize: "clamp(1.9rem,3.2vw,2.7rem)" }}>
              Access by Department
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-6">
            {personas.map((p, i) => (
              <motion.div key={p.title} {...fadeUp(i * 0.1)}
                className={`rounded-2xl border p-7 hover:-translate-y-1 transition-all duration-300 ${p.color}`}>
                <div className="flex items-start justify-between mb-4">
                  <span className="text-[2rem]">{p.icon}</span>
                  <span className={`px-3 py-1 rounded-full border text-[0.65rem] font-bold tracking-wider uppercase ${p.badgeColor}`}>
                    {p.badge}
                  </span>
                </div>
                <h3 className="font-serif text-[1.15rem] font-semibold mb-2">{p.title}</h3>
                <p className="font-sans text-[0.83rem] text-white/60 leading-relaxed mb-4">{p.desc}</p>
                <ul className="grid grid-cols-2 gap-1.5 mb-5">
                  {p.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-1.5 font-sans text-[0.75rem] text-white/55">
                      <span className="text-gold flex-shrink-0">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <a href={PORTAL_URL} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-sans font-semibold text-[0.8rem] text-gold-light hover:text-gold transition-colors">
                  Login as {p.title.split(" ")[0]} →
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── M-Pesa payment section ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-10 bg-navy-mid">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-10">
            <SectionLabel center>Fee Payments</SectionLabel>
            <h2 className="font-serif font-bold mb-3" style={{ fontSize: "clamp(1.9rem,3.2vw,2.7rem)" }}>
              Pay School Fees via M-Pesa
            </h2>
            <p className="font-sans text-white/55 max-w-lg mx-auto" style={{ fontSize: "0.9rem" }}>
              Pay your child's school fees quickly and safely using M-Pesa Paybill.
              Your payment is recorded automatically.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            {/* Paybill details */}
            <motion.div {...fadeUp(0.1)}
              className="rounded-2xl border border-gold/25 bg-gold/[0.06] p-7">
              <h3 className="font-serif text-[1.1rem] font-semibold mb-5 text-gold-light">
                📱 M-Pesa Paybill Details
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-white/[0.07]">
                  <span className="font-sans text-[0.82rem] text-white/55">Business Number</span>
                  <span className="font-serif text-[1.4rem] font-bold text-white tracking-wider">506900</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/[0.07]">
                  <span className="font-sans text-[0.82rem] text-white/55">Account Number</span>
                  <span className="font-sans text-[0.9rem] font-bold text-gold-light">
                    Child's Admission No.
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/[0.07]">
                  <span className="font-sans text-[0.82rem] text-white/55">Paybill Name</span>
                  <span className="font-sans text-[0.85rem] font-semibold text-white">Tower Sacco</span>
                </div>
                <div className="rounded-xl bg-white/[0.04] border border-white/10 p-3 mt-2">
                  <p className="font-sans text-[0.75rem] text-white/50 leading-relaxed">
                    ⚠️ <span className="text-white/70 font-medium">Important:</span> Always use your child's
                    <span className="text-gold-light font-semibold"> admission number</span> as the account
                    number. This is how the payment is matched to your child's fee record.
                    Contact the office if you don't know your child's admission number.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Steps */}
            <motion.div {...fadeUp(0.2)}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-7">
              <h3 className="font-serif text-[1.1rem] font-semibold mb-5">
                📋 How to Pay
              </h3>
              <div className="space-y-3">
                {mpesaSteps.map((s, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="font-sans text-[0.65rem] font-bold text-gold">{s.step}</span>
                    </div>
                    <p className="font-sans text-[0.83rem] text-white/65 leading-relaxed">{s.text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-white/[0.06]">
                <p className="font-sans text-[0.75rem] text-white/45">
                  Need help with payment? Call us on{" "}
                  <a href="tel:+254722777384" className="text-gold-light hover:underline">+254 722 777 384</a>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Get credentials CTA ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-10 text-center"
        style={{ background: "linear-gradient(135deg, #1c3178 0%, #162660 100%)", borderTop: "0.5px solid rgba(255,255,255,0.08)" }}>
        <div className="max-w-xl mx-auto">
          <span className="text-[2rem] block mb-3">🔐</span>
          <h2 className="font-serif font-bold mb-3" style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)" }}>
            Need Your Login Credentials?
          </h2>
          <p className="font-sans text-white/65 mb-8 leading-relaxed" style={{ fontSize: "0.92rem" }}>
            Login accounts are issued by the school administration.
            Contact us to get your username and password for the portal.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href={WA_URL} target="_blank" rel="noopener noreferrer">
              <Button variant="primary">💬 WhatsApp for Credentials</Button>
            </a>
            <Link href="/contact"><Button variant="outline">📞 Contact the Office</Button></Link>
          </div>
        </div>
      </section>
    </>
  );
}
