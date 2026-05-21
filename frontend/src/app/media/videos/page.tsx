"use client";
import { motion } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";

export default function VideosPage() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-10 bg-navy min-h-screen">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{duration:0.8}}>
          <SectionLabel center>Media</SectionLabel>
          <h1 className="font-serif font-bold mb-4" style={{fontSize:"clamp(2rem,3.5vw,3rem)"}}>Videos</h1>
          <p className="font-sans text-white/55 leading-relaxed mb-8">
            We are building our video library. School event recordings, class activities and highlights
            will be published here. Check back soon or follow us on WhatsApp for updates.
          </p>
          <div className="rounded-2xl border border-gold/20 bg-gold/[0.05] p-8">
            <div className="text-[3rem] mb-3">🎬</div>
            <p className="font-sans text-white/50 text-[0.88rem]">Videos coming soon</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
