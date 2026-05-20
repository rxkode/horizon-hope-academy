"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";
import Button from "@/components/ui/Button";
import { api } from "@/lib/api";
import type { ContactFormData } from "@/types";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] },
});

const WA_URL  = "https://wa.me/254722777384?text=Hello%2C%20I%20would%20like%20to%20enquire%20about%20Horizon%20Hope%20Academy.";
const WA_URL2 = "https://wa.me/254752777384?text=Hello%2C%20I%20would%20like%20to%20enquire%20about%20Horizon%20Hope%20Academy.";

const contactInfo = [
  {
    icon: "📍",
    title: "Physical Location",
    lines: [
      "Neighbouring Shamata Town",
      "On the right along the Shamata–Mairo Inne Road",
      "Shamata, Nyandarua County, Kenya",
    ],
  },
  {
    icon: "📞",
    title: "Phone Numbers",
    lines: ["+254 722 777 384", "+254 752 777 384"],
    links: ["tel:+254722777384", "tel:+254752777384"],
  },
  {
    icon: "✉️",
    title: "Email Address",
    lines: ["info@horizonhopeacademy.sc.ke"],
    links: ["mailto:info@horizonhopeacademy.sc.ke"],
  },
  {
    icon: "🕐",
    title: "Office Hours",
    lines: ["Monday – Friday", "8:00 AM – 5:00 PM"],
  },
];

export default function ContactPage() {
  const [form, setForm] = useState<ContactFormData>({
    name: "", email: "", phone: "", subject: "", message: "",
  });
  const [status, setStatus] = useState<"idle"|"sending"|"sent"|"error">("idle");

  const handle = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await api.submitContact(form);
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
            <SectionLabel center>Get in Touch</SectionLabel>
            <h1 className="font-serif font-bold mb-4" style={{ fontSize: "clamp(2.2rem,4vw,3.5rem)" }}>
              Contact Us
            </h1>
            <p className="font-sans text-white/65 leading-relaxed max-w-xl mx-auto mb-8"
              style={{ fontSize: "clamp(0.9rem,1.5vw,1.05rem)" }}>
              We are always happy to hear from parents, guardians, and community members.
              Reach us by phone, WhatsApp, email, or visit us in Shamata.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a href={WA_URL} target="_blank" rel="noopener noreferrer">
                <Button variant="primary">💬 WhatsApp Us</Button>
              </a>
              <a href="tel:+254722777384">
                <Button variant="outline">📞 Call Now</Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Contact info cards ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-10 bg-navy">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
            {contactInfo.map((c, i) => (
              <motion.div key={c.title} {...fadeUp(i * 0.08)}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 hover:border-gold/25 hover:bg-white/[0.07] transition-all text-center">
                <div className="text-[2rem] mb-3">{c.icon}</div>
                <h3 className="font-serif text-[0.95rem] font-semibold mb-3 text-gold-light">{c.title}</h3>
                <div className="space-y-1">
                  {c.lines.map((line, j) => (
                    c.links?.[j] ? (
                      <a key={j} href={c.links[j]}
                        className="block font-sans text-[0.82rem] text-white/70 hover:text-gold-light transition-colors">
                        {line}
                      </a>
                    ) : (
                      <p key={j} className="font-sans text-[0.82rem] text-white/70">{line}</p>
                    )
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* WhatsApp quick contact */}
          <motion.div {...fadeUp(0.2)}
            className="rounded-2xl border border-green-500/20 bg-green-500/[0.05] p-6 mb-16 text-center">
            <div className="text-[1.8rem] mb-2">💬</div>
            <h3 className="font-serif text-[1.1rem] font-semibold mb-2">Fastest Way to Reach Us</h3>
            <p className="font-sans text-[0.85rem] text-white/60 mb-4">
              WhatsApp is the quickest way to get a response from our team. Send us a message any time.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <a href={WA_URL} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-green-500/40 text-green-400 font-sans font-semibold text-[0.82rem] hover:bg-green-500/10 transition-all">
                💬 +254 722 777 384
              </a>
              <a href={WA_URL2} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-green-500/40 text-green-400 font-sans font-semibold text-[0.82rem] hover:bg-green-500/10 transition-all">
                💬 +254 752 777 384
              </a>
            </div>
          </motion.div>

          {/* Map + Form side by side */}
          <div className="grid lg:grid-cols-2 gap-8">

            {/* Directions */}
            <motion.div {...fadeUp(0.1)}>
              <h2 className="font-serif text-[1.3rem] font-semibold mb-5">How to Find Us</h2>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 mb-4">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <span className="text-gold text-[1.1rem] flex-shrink-0">📍</span>
                    <div>
                      <div className="font-sans font-semibold text-[0.88rem] text-white mb-1">From Shamata Town</div>
                      <p className="font-sans text-[0.82rem] text-white/60 leading-relaxed">
                        We are located neighbouring Shamata town, on the <strong className="text-white">right side</strong> along
                        the <strong className="text-white">Shamata–Mairo Inne Road</strong>. Look for the school sign at the gate.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-gold text-[1.1rem] flex-shrink-0">🚐</span>
                    <div>
                      <div className="font-sans font-semibold text-[0.88rem] text-white mb-1">By Matatu</div>
                      <p className="font-sans text-[0.82rem] text-white/60 leading-relaxed">
                        Take a matatu from Ol Kalou or Nyahururu heading to Shamata. Alight at Shamata town centre
                        and the school is a short walk along the Mairo Inne road.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-gold text-[1.1rem] flex-shrink-0">📞</span>
                    <div>
                      <div className="font-sans font-semibold text-[0.88rem] text-white mb-1">Call for Directions</div>
                      <p className="font-sans text-[0.82rem] text-white/60 leading-relaxed">
                        Not sure? Call us on{" "}
                        <a href="tel:+254722777384" className="text-gold-light hover:underline">+254 722 777 384</a>{" "}
                        and we will guide you directly to the school.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Embedded Google Map */}
              <div className="rounded-2xl overflow-hidden border border-white/10" style={{ height: "250px" }}>
                <iframe
                  src="https://maps.google.com/maps?q=Shamata,Nyandarua,Kenya&t=&z=13&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Shamata, Nyandarua — Google Maps"
                />
              </div>
            </motion.div>

            {/* Contact form */}
            <motion.div {...fadeUp(0.2)}>
              <h2 className="font-serif text-[1.3rem] font-semibold mb-5">Send Us a Message</h2>
              {status === "sent" ? (
                <div className="rounded-2xl border border-gold/30 bg-gold/[0.08] p-8 text-center">
                  <div className="text-[2.5rem] mb-3">✅</div>
                  <h3 className="font-serif text-[1.2rem] font-semibold mb-2">Message Received!</h3>
                  <p className="font-sans text-white/65 text-[0.85rem]">
                    Thank you for reaching out. We will respond within one business day.
                    For urgent matters please call <a href="tel:+254722777384" className="text-gold-light underline">+254 722 777 384</a>.
                  </p>
                </div>
              ) : (
                <form onSubmit={submit} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-sans text-[0.73rem] text-white/50 mb-1.5 uppercase tracking-wider">Your Name *</label>
                      <input name="name" required value={form.name} onChange={handle}
                        className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5 font-sans text-[0.85rem] text-white placeholder-white/25 focus:outline-none focus:border-gold/40 transition-colors"
                        placeholder="Full name" />
                    </div>
                    <div>
                      <label className="block font-sans text-[0.73rem] text-white/50 mb-1.5 uppercase tracking-wider">Phone</label>
                      <input name="phone" value={form.phone} onChange={handle}
                        className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5 font-sans text-[0.85rem] text-white placeholder-white/25 focus:outline-none focus:border-gold/40 transition-colors"
                        placeholder="+254 7XX XXX XXX" />
                    </div>
                  </div>
                  <div>
                    <label className="block font-sans text-[0.73rem] text-white/50 mb-1.5 uppercase tracking-wider">Email</label>
                    <input name="email" type="email" value={form.email} onChange={handle}
                      className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5 font-sans text-[0.85rem] text-white placeholder-white/25 focus:outline-none focus:border-gold/40 transition-colors"
                      placeholder="your@email.com" />
                  </div>
                  <div>
                    <label className="block font-sans text-[0.73rem] text-white/50 mb-1.5 uppercase tracking-wider">Subject *</label>
                    <input name="subject" required value={form.subject} onChange={handle}
                      className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5 font-sans text-[0.85rem] text-white placeholder-white/25 focus:outline-none focus:border-gold/40 transition-colors"
                      placeholder="e.g. Admission enquiry, General question..." />
                  </div>
                  <div>
                    <label className="block font-sans text-[0.73rem] text-white/50 mb-1.5 uppercase tracking-wider">Message *</label>
                    <textarea name="message" required rows={4} value={form.message} onChange={handle}
                      className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5 font-sans text-[0.85rem] text-white placeholder-white/25 focus:outline-none focus:border-gold/40 transition-colors resize-none"
                      placeholder="How can we help you?" />
                  </div>
                  {status === "error" && (
                    <p className="font-sans text-[0.78rem] text-red-400">
                      Failed to send. Please call us directly on +254 722 777 384.
                    </p>
                  )}
                  <button type="submit" disabled={status === "sending"}
                    className="w-full py-3 rounded-xl font-sans font-semibold text-[0.85rem] tracking-wide transition-all duration-200 border border-gold text-gold-light hover:bg-gold hover:text-navy disabled:opacity-50">
                    {status === "sending" ? "Sending..." : "Send Message →"}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
