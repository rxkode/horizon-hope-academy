"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import SectionLabel from "@/components/ui/SectionLabel";
import Button from "@/components/ui/Button";

const f = (delay=0) => ({
  initial:{opacity:0,y:28},
  whileInView:{opacity:1,y:0},
  viewport:{once:true,margin:"-60px"},
  transition:{duration:0.8,delay,ease:[0.22,1,0.36,1] as [number,number,number,number]},
});

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-[68px] topo-bg">
      <div className="absolute inset-0 bg-navy-gradient pointer-events-none" />
      <div className="relative z-10">

        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20 grid lg:grid-cols-2 gap-14 items-center">
          <motion.div {...f()}>
            <SectionLabel>Our Story</SectionLabel>
            <h1 className="font-serif text-[clamp(2.4rem,4vw,3.6rem)] font-bold mb-5 leading-[1.1]">
              Born from This Community.<br/>
              <span className="italic text-gold-light">Built for Its Children.</span>
            </h1>
            <div className="w-10 h-0.5 bg-gradient-to-r from-gold to-transparent rounded mb-5" />
            <div className="space-y-4 font-sans text-[0.91rem] text-mist/80 font-light leading-[1.87]">
              <p>Horizon Hope Academy Schools was founded in 2009 by educators from Shamata who believed every child in the Aberdares highlands deserved quality private education — close to home, rooted in local values.</p>
              <p>We are a fully registered institution and have proudly served this community for over 16 years as a nurturing mixed day school for boys and girls, from Pre-Primary through Junior Secondary (Grade 9).</p>
              <p>Our main objective has always been to provide quality education to all, guide and counsel our learners, and integrate moral values to produce holistic individuals and reliable citizens from age 3 to 15. We welcome pupils of all backgrounds and denominations.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-8">
              {["❤️ Every child seen & known","📚 CBC excellence","🌿 Proud of our highlands","🤝 Community partnership","🙏 Open to all faiths","🏅 Strong KCPE record"].map(v => (
                <div key={v} className="flex items-center gap-2 font-sans text-[0.83rem] text-white/82">
                  <span>{v}</span>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div {...f(0.2)} className="flex items-center justify-center">
            <div className="relative w-[300px] h-[300px] md:w-[360px] md:h-[360px] drop-shadow-[0_16px_48px_rgba(196,146,42,0.22)]">
              <Image src="/assets/logo-official.png" alt="Horizon Hope Academy Schools Official Seal" fill sizes="360px" className="object-contain" />
            </div>
          </motion.div>
        </section>

        {/* Values strip */}
        <section className="bg-navy-mid border-y border-white/[0.06] py-16 px-6 lg:px-10">
          <div className="max-w-7xl mx-auto">
            <motion.div {...f()} className="text-center mb-10">
              <SectionLabel center>Our Motto</SectionLabel>
              <h2 className="font-serif text-[clamp(1.8rem,3vw,2.6rem)] font-bold italic text-gold-light">"Committed Service to Excellence"</h2>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                {icon:"🎓",title:"Committed",desc:"We are fully dedicated to every learner's growth — in academics, character, and life skills."},
                {icon:"🤲",title:"Service",desc:"We serve the Shamata community with humility, partnership, and genuine care for every family."},
                {icon:"⭐",title:"Excellence",desc:"We set high standards and support every child to reach them — at their own pace, in their own way."},
              ].map((v,i) => (
                <motion.div key={v.title} {...f(i*0.1)} className="glass rounded-2xl p-7 text-center hover:border-gold/25 transition-all">
                  <div className="text-3xl mb-4">{v.icon}</div>
                  <h3 className="font-serif text-xl font-semibold mb-2">{v.title}</h3>
                  <p className="font-sans text-sm text-mist/75 leading-relaxed">{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 lg:px-10 text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="font-serif text-[clamp(1.8rem,3vw,2.4rem)] font-bold mb-4">Ready to Join Our Family?</h2>
            <p className="font-sans text-sm text-mist/80 mb-8 leading-relaxed">Enrolment is open. Come visit us in Shamata and see what Horizon Hope is all about.</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/admissions"><Button variant="primary">Apply Now →</Button></Link>
              <Link href="/contact"><Button variant="outline">Contact Us</Button></Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
