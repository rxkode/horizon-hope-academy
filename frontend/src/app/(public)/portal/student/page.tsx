"use client";
import { motion } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";

const PORTAL_URL = "http://localhost:8080";

export default function StudentLoginPage() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-10 bg-navy min-h-screen">
      <div className="max-w-md mx-auto text-center">
        <motion.div initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{duration:0.8}}>
          <SectionLabel center>Portal</SectionLabel>
          <div className="text-[3rem] mb-4">🎓</div>
          <h1 className="font-serif font-bold mb-3" style={{fontSize:"clamp(1.8rem,3vw,2.5rem)"}}>
            Student Login
          </h1>
          <p className="font-sans text-white/55 leading-relaxed mb-8">
            Click below to access the Horizon Hope Academy school management portal.
            Contact the school office if you need your login credentials.
          </p>
          <a href={PORTAL_URL} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full border border-gold text-gold-light font-sans font-semibold text-[0.88rem] hover:bg-gold hover:text-navy transition-all duration-200">
            🔐 Open Portal →
          </a>
          <p className="font-sans text-white/35 text-[0.75rem] mt-4">
            Need help? Call <a href="tel:+254722777384" className="text-gold-light hover:underline">+254 722 777 384</a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
