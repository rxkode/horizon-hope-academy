"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import type { ContactFormData } from "@/types";
import Button from "@/components/ui/Button";
import SectionLabel from "@/components/ui/SectionLabel";

const empty: ContactFormData = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export default function ContactPage() {
  const [form, setForm] = useState<ContactFormData>(empty);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errMsg, setErrMsg] = useState("");

  const set =
    (k: keyof ContactFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await api.submitContact(form);
      setStatus("success");
      setForm(empty);
    } catch (err: unknown) {
      setErrMsg(err instanceof Error ? err.message : "Submission failed.");
      setStatus("error");
    }
  };

  const field =
    "w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder:text-mist/40 font-sans text-sm outline-none focus:border-gold/50 transition-colors";

  return (
    <div className="min-h-screen pt-[68px] topo-bg">
      <div className="absolute inset-0 bg-navy-gradient pointer-events-none" />
      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10 py-20 grid lg:grid-cols-2 gap-16 items-start">
        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <SectionLabel>Contact Us</SectionLabel>
          <h1 className="font-serif text-[clamp(2.2rem,4vw,3.5rem)] font-bold mb-4">
            Get in Touch
          </h1>
          <p className="font-sans text-[0.92rem] text-mist/80 font-light leading-relaxed mb-10">
            We&apos;d love to hear from you. Whether you have a question about
            admissions, fees, or school life — our team is here to help.
          </p>
          <div className="space-y-5">
            {[
              {
                icon: "📞",
                label: "Phone",
                val: "+254 722 777 384",
                sub: "Mon–Fri, 8am–5pm",
              },
              {
                icon: "✉️",
                label: "Email",
                val: "info@horizonhopeacademy.sc.ke",
              },
              {
                icon: "📍",
                label: "Address",
                val: "Shamata, Nyandarua County, Kenya",
                sub: "Near the Aberdare Ranges",
              },
              { icon: "📮", label: "P.O. Box", val: "20304-4, Kaheho" },
            ].map((c) => (
              <div key={c.label} className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-gold/[0.1] border border-gold/20 flex items-center justify-center text-lg flex-shrink-0 mt-1">
                  {c.icon}
                </div>
                <div>
                  <div className="font-sans text-xs text-mist/50 tracking-widest uppercase mb-0.5">
                    {c.label}
                  </div>
                  <div className="font-sans text-sm text-white">{c.val}</div>
                  {c.sub && (
                    <div className="font-sans text-xs text-mist/60">
                      {c.sub}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          {status === "success" ? (
            <div className="glass rounded-2xl p-10 text-center">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="font-serif text-2xl font-bold mb-2">
                Message Sent!
              </h2>
              <p className="font-sans text-mist/80 text-sm mb-6">
                We'll get back to you within 1 working day.
              </p>
              <Button onClick={() => setStatus("idle")}>Send Another →</Button>
            </div>
          ) : (
            <form onSubmit={submit} className="glass rounded-2xl p-8 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-sans text-xs text-mist/70 mb-1.5 uppercase tracking-wide">
                    Name *
                  </label>
                  <input
                    required
                    className={field}
                    value={form.name}
                    onChange={set("name")}
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block font-sans text-xs text-mist/70 mb-1.5 uppercase tracking-wide">
                    Email *
                  </label>
                  <input
                    required
                    type="email"
                    className={field}
                    value={form.email}
                    onChange={set("email")}
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block font-sans text-xs text-mist/70 mb-1.5 uppercase tracking-wide">
                  Phone (optional)
                </label>
                <input
                  className={field}
                  value={form.phone}
                  onChange={set("phone")}
                  placeholder="0712 345 678"
                />
              </div>
              <div>
                <label className="block font-sans text-xs text-mist/70 mb-1.5 uppercase tracking-wide">
                  Subject *
                </label>
                <input
                  required
                  className={field}
                  value={form.subject}
                  onChange={set("subject")}
                  placeholder="e.g. Enquiry about Grade 3 admissions"
                />
              </div>
              <div>
                <label className="block font-sans text-xs text-mist/70 mb-1.5 uppercase tracking-wide">
                  Message *
                </label>
                <textarea
                  required
                  rows={5}
                  className={`${field} resize-none`}
                  value={form.message}
                  onChange={set("message")}
                  placeholder="Your message..."
                />
              </div>
              {status === "error" && (
                <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  ⚠️ {errMsg}
                </div>
              )}
              <Button
                type="submit"
                disabled={status === "loading"}
                variant="primary"
                className="w-full justify-center"
              >
                {status === "loading" ? "Sending..." : "Send Message →"}
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
