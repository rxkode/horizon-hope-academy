"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import SectionLabel from "@/components/ui/SectionLabel";
import Button from "@/components/ui/Button";
import { api } from "@/lib/api";
import type { AdmissionFormData } from "@/types";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] },
});

const steps = [
  { step: "Step 01", icon: "📍", title: "Visit the School",
    desc: "Come and see our campus in Shamata — neighbouring Shamata town on the right along the Shamata–Mairo Inne road. Meet our teachers and feel the Horizon Hope community firsthand. No appointment needed." },
  { step: "Step 02", icon: "📋", title: "Submit Your Application",
    desc: "Collect an enrolment form from the school office and complete it together with the required documents listed below. Our staff will guide you through every step." },
  { step: "Step 03", icon: "✅", title: "Confirmation & Fees",
    desc: "Once your application is reviewed and the learner is confirmed, fees arrangements are made with the school office. Your child is then warmly welcomed into the Horizon Hope family." },
];

const requirements = [
  {
    level: "Pre-Primary (PP1 & PP2)",
    icon: "🌱",
    docs: [
      "Child\'s Birth Certificate (photocopy)",
      "Parent / Guardian National ID or Passport (copy)",
      "2 recent passport-size photos of the child",
      "Immunization / Clinic Card (vaccination record)",
      "Child must be at least 4 years old for PP1",
    ],
  },
  {
    level: "Primary (Grade 1 – Grade 6)",
    icon: "📖",
    docs: [
      "Child\'s Birth Certificate (photocopy)",
      "Parent / Guardian National ID or Passport (copy)",
      "2 recent passport-size photos",
      "Most recent academic report / progress form",
      "School Leaving Certificate or Clearance Letter (transfers)",
      "NEMIS / UPI Number",
    ],
  },
  {
    level: "Junior School (Grade 7 – Grade 9)",
    icon: "🎓",
    docs: [
      "Child\'s Birth Certificate (photocopy)",
      "Parent / Guardian National ID or Passport (copy)",
      "2 recent passport-size photos",
      "KPSEA Assessment Results (certified copy)",
      "Grade 7 & 8 Report Forms (if enrolling into Grade 9)",
      "CBC Assessment Number (KNEC)",
      "NEMIS / UPI Number — must be released from previous school",
    ],
  },
];

const schoolForms = [
  { icon: "📝", name: "Student Data Capture Form", desc: "For updating NEMIS details including home county, sub-county, and physical address." },
  { icon: "🏥", name: "Medical Declaration Form",  desc: "Declaring any chronic conditions, allergies, or special needs requirements." },
];

const grades = [
  "PP1", "PP2",
  "Grade 1", "Grade 2", "Grade 3",
  "Grade 4", "Grade 5", "Grade 6",
  "Grade 7", "Grade 8", "Grade 9",
];

export default function AdmissionsPage() {
  const [form, setForm] = useState<AdmissionFormData>({
    guardian_name: "", guardian_email: "", guardian_phone: "",
    child_name: "", child_dob: "", grade_applying: "", message: "",
  });
  const [status, setStatus] = useState<"idle"|"sending"|"sent"|"error">("idle");

  const handle = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await api.submitAdmission(form);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-10 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0b1535 0%, #1c3178 50%, #0d1b45 100%)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "repeating-linear-gradient(-30deg,transparent,transparent 38px,rgba(100,130,210,0.04) 38px,rgba(100,130,210,0.04) 39px)" }} />
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div {...fadeUp()}>
            <SectionLabel center>Admissions 2025 / 2026</SectionLabel>
            <h1 className="font-serif font-bold mb-4" style={{ fontSize: "clamp(2.2rem,4vw,3.5rem)" }}>
              Join Our School Family
            </h1>
            <p className="font-sans text-white/65 leading-relaxed max-w-2xl mx-auto mb-8"
              style={{ fontSize: "clamp(0.9rem,1.5vw,1.05rem)" }}>
              Enrolment is open for the 2025/2026 academic year across all grades from PP1 to Grade 9.
              We welcome learners of all backgrounds into our warm, inclusive community.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a href="https://wa.me/254722777384?text=Hello%2C%20I%20would%20like%20to%20enquire%20about%20admission%20at%20Horizon%20Hope%20Academy."
                target="_blank" rel="noopener noreferrer">
                <Button variant="primary">💬 WhatsApp Us Now</Button>
              </a>
              <Link href="#apply"><Button variant="outline">Apply Online →</Button></Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Term dates ── */}
      <div className="bg-white/[0.03] border-y border-white/[0.06] py-5 px-4">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-6">
          {[
            { term: "Term 1 2026", dates: "Jan – Apr", status: "Completed" },
            { term: "Term 2 2026", dates: "May – Aug", status: "Current", current: true },
            { term: "Term 3 2026", dates: "Sept – Nov", status: "Upcoming" },
          ].map(t => (
            <div key={t.term} className="text-center">
              <div className={`inline-block px-3 py-0.5 rounded-full text-[0.62rem] font-bold tracking-wider uppercase mb-1 ${t.current ? "bg-gold/20 border border-gold/40 text-gold-light" : "bg-white/[0.06] border border-white/10 text-white/40"}`}>
                {t.status}
              </div>
              <div className="font-serif font-semibold text-white text-[0.88rem]">{t.term}</div>
              <div className="font-sans text-white/45 text-[0.75rem]">{t.dates}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Fees notice ── */}
      <div className="bg-gold/[0.08] border-y border-gold/20 py-5 px-4 text-center">
        <p className="font-sans text-[0.88rem] text-white/75">
          📞 For the current fees structure, please contact the school office directly on{" "}
          <a href="tel:+254722777384" className="text-gold-light font-semibold hover:underline">+254 722 777 384</a>
          {" "}or{" "}
          <a href="tel:+254752777384" className="text-gold-light font-semibold hover:underline">+254 752 777 384</a>
        </p>
      </div>

      {/* ── Steps ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-10 bg-navy">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-12">
            <SectionLabel center>How to Enrol</SectionLabel>
            <h2 className="font-serif font-bold" style={{ fontSize: "clamp(1.9rem,3.2vw,2.7rem)" }}>
              Three Simple Steps
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-5">
            {steps.map((s, i) => (
              <motion.div key={s.step} {...fadeUp(i * 0.1)}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 hover:border-gold/25 transition-all">
                <div className="text-[1.8rem] mb-3">{s.icon}</div>
                <div className="text-gold font-bold font-sans text-[0.6rem] tracking-[0.14em] uppercase mb-1">{s.step}</div>
                <h3 className="font-serif text-[1.05rem] font-semibold mb-2">{s.title}</h3>
                <p className="font-sans text-[0.82rem] text-white/60 leading-[1.75]">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Requirements ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-10 bg-navy-mid">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-12">
            <SectionLabel center>What to Bring</SectionLabel>
            <h2 className="font-serif font-bold mb-3" style={{ fontSize: "clamp(1.9rem,3.2vw,2.7rem)" }}>
              Required Documents
            </h2>
            <p className="font-sans text-white/55 max-w-lg mx-auto" style={{ fontSize: "0.9rem" }}>
              Documents required vary by grade level. Please bring originals and photocopies.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-5 mb-10">
            {requirements.map((r, i) => (
              <motion.div key={r.level} {...fadeUp(i * 0.1)}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 hover:border-gold/25 transition-all">
                <div className="text-[1.8rem] mb-2">{r.icon}</div>
                <h3 className="font-serif text-[1rem] font-semibold mb-3 text-gold-light">{r.level}</h3>
                <ul className="space-y-1.5">
                  {r.docs.map((d, j) => (
                    <li key={j} className="flex items-start gap-2 font-sans text-[0.78rem] text-white/60">
                      <span className="text-gold mt-0.5 flex-shrink-0">✓</span>
                      {d}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* School-issued forms */}
          <motion.div {...fadeUp(0.3)}
            className="rounded-2xl border border-gold/20 bg-gold/[0.05] p-6">
            <h3 className="font-serif text-[1.05rem] font-semibold mb-4 text-gold-light">
              📋 Forms Issued by the School on Arrival
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {schoolForms.map(f => (
                <div key={f.name} className="flex gap-3">
                  <span className="text-[1.3rem] flex-shrink-0">{f.icon}</span>
                  <div>
                    <div className="font-sans font-semibold text-[0.85rem] text-white mb-0.5">{f.name}</div>
                    <div className="font-sans text-[0.78rem] text-white/55 leading-relaxed">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/[0.06]">
              <p className="font-sans text-[0.78rem] text-white/50 leading-relaxed">
                <span className="text-gold font-semibold">⚠️ Grade 9 Note:</span> Ensure the learner is officially
                released from their previous school on NEMIS before applying. A student still active on another
                school&apos;s NEMIS portal cannot be fully registered with us.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Uniform ── */}
      <section className="py-12 px-4 sm:px-6 lg:px-10 bg-navy border-y border-white/[0.06]">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div {...fadeUp()}>
            <span className="text-[2rem] block mb-3">👕</span>
            <h3 className="font-serif text-[1.2rem] font-semibold mb-2">School Uniform</h3>
            <p className="font-sans text-[0.85rem] text-white/60 leading-relaxed">
              Horizon Hope Academy has an official school uniform. Uniform is available for purchase in
              <span className="text-white font-medium"> Nyahururu town</span>. Please contact the school
              office for the current uniform supplier details and specifications.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Online enquiry form ── */}
      <section id="apply" className="py-20 px-4 sm:px-6 lg:px-10 bg-navy-mid">
        <div className="max-w-2xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-10">
            <SectionLabel center>Enquire Online</SectionLabel>
            <h2 className="font-serif font-bold mb-3" style={{ fontSize: "clamp(1.7rem,3vw,2.4rem)" }}>
              Send an Admission Enquiry
            </h2>
            <p className="font-sans text-white/55" style={{ fontSize: "0.88rem" }}>
              Fill in the form below and our team will get back to you within one business day.
            </p>
          </motion.div>

          {status === "sent" ? (
            <motion.div {...fadeUp()}
              className="rounded-2xl border border-gold/30 bg-gold/[0.08] p-8 text-center">
              <div className="text-[2.5rem] mb-3">🎉</div>
              <h3 className="font-serif text-[1.3rem] font-semibold mb-2">Enquiry Received!</h3>
              <p className="font-sans text-white/65 text-[0.88rem]">
                Thank you for your interest in Horizon Hope Academy. We will be in touch with you shortly.
                You are also welcome to call us directly on{" "}
                <a href="tel:+254722777384" className="text-gold-light underline">+254 722 777 384</a>.
              </p>
            </motion.div>
          ) : (
            <motion.form {...fadeUp(0.1)} onSubmit={submit}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-7 space-y-4">

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-sans text-[0.75rem] text-white/50 mb-1.5 uppercase tracking-wider">Parent / Guardian Name *</label>
                  <input name="guardian_name" required value={form.guardian_name} onChange={handle}
                    className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5 font-sans text-[0.88rem] text-white placeholder-white/25 focus:outline-none focus:border-gold/40 transition-colors"
                    placeholder="Your full name" />
                </div>
                <div>
                  <label className="block font-sans text-[0.75rem] text-white/50 mb-1.5 uppercase tracking-wider">Phone Number *</label>
                  <input name="guardian_phone" required value={form.guardian_phone} onChange={handle}
                    className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5 font-sans text-[0.88rem] text-white placeholder-white/25 focus:outline-none focus:border-gold/40 transition-colors"
                    placeholder="+254 7XX XXX XXX" />
                </div>
              </div>

              <div>
                <label className="block font-sans text-[0.75rem] text-white/50 mb-1.5 uppercase tracking-wider">Email Address</label>
                <input name="guardian_email" type="email" value={form.guardian_email} onChange={handle}
                  className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5 font-sans text-[0.88rem] text-white placeholder-white/25 focus:outline-none focus:border-gold/40 transition-colors"
                  placeholder="your@email.com (optional)" />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-sans text-[0.75rem] text-white/50 mb-1.5 uppercase tracking-wider">Child&apos;s Name *</label>
                  <input name="child_name" required value={form.child_name} onChange={handle}
                    className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5 font-sans text-[0.88rem] text-white placeholder-white/25 focus:outline-none focus:border-gold/40 transition-colors"
                    placeholder="Child&apos;s full name" />
                </div>
                <div>
                  <label className="block font-sans text-[0.75rem] text-white/50 mb-1.5 uppercase tracking-wider">Grade Applying For *</label>
                  <select name="grade_applying" required value={form.grade_applying} onChange={handle}
                    className="w-full bg-navy border border-white/10 rounded-xl px-4 py-2.5 font-sans text-[0.88rem] text-white focus:outline-none focus:border-gold/40 transition-colors">
                    <option value="">Select grade</option>
                    {["PP1","PP2","Grade 1","Grade 2","Grade 3","Grade 4","Grade 5","Grade 6","Grade 7","Grade 8","Grade 9"].map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-sans text-[0.75rem] text-white/50 mb-1.5 uppercase tracking-wider">Date of Birth</label>
                <input name="child_dob" type="date" value={form.child_dob} onChange={handle}
                  className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5 font-sans text-[0.88rem] text-white focus:outline-none focus:border-gold/40 transition-colors" />
              </div>

              <div>
                <label className="block font-sans text-[0.75rem] text-white/50 mb-1.5 uppercase tracking-wider">Additional Message</label>
                <textarea name="message" rows={3} value={form.message} onChange={handle}
                  className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5 font-sans text-[0.88rem] text-white placeholder-white/25 focus:outline-none focus:border-gold/40 transition-colors resize-none"
                  placeholder="Any questions or special requirements..." />
              </div>

              {status === "error" && (
                <p className="font-sans text-[0.8rem] text-red-400">
                  Something went wrong. Please call us directly on +254 722 777 384.
                </p>
              )}

              <button type="submit" disabled={status === "sending"}
                className="w-full py-3 rounded-xl font-sans font-semibold text-[0.88rem] tracking-wide transition-all duration-200 border border-gold text-gold-light hover:bg-gold hover:text-navy disabled:opacity-50">
                {status === "sending" ? "Sending..." : "Submit Enquiry →"}
              </button>
            </motion.form>
          )}
        </div>
      </section>
    </>
  );
}
