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

const WA_URL = "https://wa.me/254722777384?text=Hello%2C%20I%20am%20interested%20in%20a%20career%20opportunity%20at%20Horizon%20Hope%20Academy.";

const values = [
  { icon: "🌱", title: "Grow With Us", desc: "We invest in our staff through continuous professional development, CBC training, and leadership opportunities." },
  { icon: "🤝", title: "Collaborative Culture", desc: "Work in a supportive team environment where every voice is heard and every contribution is valued." },
  { icon: "🎯", title: "Purpose-Driven Work", desc: "Make a real difference in the lives of children and families in the Shamata community every single day." },
  { icon: "🏡", title: "Beautiful Setting", desc: "Work in the scenic highlands of the Aberdares — fresh air, green landscapes, and a tight-knit community." },
];

export default function CareersPage() {
  return (
    <>
      <section className="relative py-20 px-4 sm:px-6 lg:px-10 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0b1535 0%, #1c3178 50%, #0d1b45 100%)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "repeating-linear-gradient(-30deg,transparent,transparent 38px,rgba(100,130,210,0.04) 38px,rgba(100,130,210,0.04) 39px)" }} />
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div {...fadeUp()}>
            <SectionLabel center>Careers</SectionLabel>
            <h1 className="font-serif font-bold mb-4" style={{ fontSize: "clamp(2.2rem,4vw,3.5rem)" }}>
              Join Our Team
            </h1>
            <p className="font-sans text-white/65 leading-relaxed max-w-xl mx-auto mb-8"
              style={{ fontSize: "clamp(0.9rem,1.5vw,1.05rem)" }}>
              We are always looking for passionate, dedicated educators and support staff who share
              our commitment to excellence and community service.
            </p>
            <a href={WA_URL} target="_blank" rel="noopener noreferrer">
              <Button variant="primary">💬 Express Interest</Button>
            </a>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-10 bg-navy">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-12">
            <SectionLabel center>Why Work Here</SectionLabel>
            <h2 className="font-serif font-bold" style={{ fontSize: "clamp(1.9rem,3.2vw,2.7rem)" }}>
              Why Choose Horizon Hope Academy?
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-5 mb-16">
            {values.map((v, i) => (
              <motion.div key={v.title} {...fadeUp(i * 0.1)}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-7 hover:border-gold/25 transition-all">
                <span className="text-[1.8rem] mb-3 block">{v.icon}</span>
                <h3 className="font-serif text-[1.05rem] font-semibold mb-2 text-gold-light">{v.title}</h3>
                <p className="font-sans text-[0.85rem] text-white/60 leading-[1.8]">{v.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp(0.2)}
            className="rounded-2xl border border-gold/20 bg-gold/[0.05] p-8 text-center">
            <span className="text-[2rem] block mb-3">📋</span>
            <h3 className="font-serif text-[1.3rem] font-semibold mb-3">Current Vacancies</h3>
            <p className="font-sans text-[0.88rem] text-white/60 leading-relaxed mb-6">
              We do not have any advertised vacancies at this time. However, we welcome speculative
              applications from qualified and passionate educators. Send us your CV and a brief
              introduction via WhatsApp or email.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a href={WA_URL} target="_blank" rel="noopener noreferrer">
                <Button variant="primary">💬 Send CV via WhatsApp</Button>
              </a>
              <a href="mailto:horizonhopeacademy.sc@gmail.com?subject=Career%20Enquiry%20%E2%80%94%20Horizon%20Hope%20Academy">
                <Button variant="outline">✉️ Email Your CV</Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
