"use client";
/**
 * Full Gallery Page — /gallery
 *
 * ADDING REAL PHOTOS:
 *   1. Copy photos to: frontend/public/assets/gallery/
 *   2. Name them: gallery-01.jpg through gallery-12.jpg
 *   3. Update the `allPhotos` array captions below.
 *   4. Replace each src with "/assets/gallery/gallery-NN.jpg"
 *   5. Run: npm run build && vercel --prod
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import SectionLabel from "@/components/ui/SectionLabel";
import Button from "@/components/ui/Button";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] },
});

const WA_URL = "https://wa.me/254722777384?text=Hello%2C%20I%20would%20like%20to%20enquire%20about%20Horizon%20Hope%20Academy.";

type Category = "All" | "Classroom" | "Sports" | "Activities" | "Campus";

const allPhotos: { src: string; alt: string; caption: string; category: Category }[] = [
  { src: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80", alt: "Learners reading", caption: "Reading & Discovery", category: "Classroom" },
  { src: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80", alt: "CBC classroom learning", caption: "CBC Classroom Learning", category: "Classroom" },
  { src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80", alt: "Teacher with students", caption: "Personal Attention", category: "Classroom" },
  { src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80", alt: "Computer lab", caption: "Computer & ICT Lab", category: "Classroom" },
  { src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80", alt: "Football on the field", caption: "Football & Athletics", category: "Sports" },
  { src: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80", alt: "Children running", caption: "Sports Day", category: "Sports" },
  { src: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&q=80", alt: "School farm", caption: "Agriculture & Farming", category: "Activities" },
  { src: "https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&q=80", alt: "Children doing art", caption: "Music & Arts", category: "Activities" },
  { src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80", alt: "Drama performance", caption: "Drama & Storytelling", category: "Activities" },
  { src: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800&q=80", alt: "School grounds", caption: "Our Campus", category: "Campus" },
  { src: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80", alt: "Dining hall", caption: "Dining Hall", category: "Campus" },
  { src: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=800&q=80", alt: "Highland landscape", caption: "Shamata, Aberdares", category: "Campus" },
];

const categories: Category[] = ["All", "Classroom", "Sports", "Activities", "Campus"];

export default function GalleryPage() {
  const [active, setActive] = useState<Category>("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = active === "All" ? allPhotos : allPhotos.filter(p => p.category === active);

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-10 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0b1535 0%, #1c3178 50%, #0d1b45 100%)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "repeating-linear-gradient(-30deg,transparent,transparent 38px,rgba(100,130,210,0.04) 38px,rgba(100,130,210,0.04) 39px)" }} />
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div {...fadeUp()}>
            <SectionLabel center>Photo Gallery</SectionLabel>
            <h1 className="font-serif font-bold mb-4" style={{ fontSize: "clamp(2.2rem,4vw,3.5rem)" }}>
              Life at Horizon Hope Academy
            </h1>
            <p className="font-sans text-white/65 leading-relaxed max-w-xl mx-auto"
              style={{ fontSize: "clamp(0.9rem,1.5vw,1.05rem)" }}>
              A window into the vibrant daily life of our learners — in the classroom, on the field,
              and across every corner of our campus in Shamata.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Gallery ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-10 bg-navy">
        <div className="max-w-7xl mx-auto">

          {/* Filter tabs */}
          <motion.div {...fadeUp()} className="flex flex-wrap gap-2 justify-center mb-10">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActive(cat)}
                className={`px-4 py-2 rounded-full font-sans text-[0.78rem] font-semibold transition-all duration-200 ${
                  active === cat
                    ? "bg-gold text-navy border border-gold"
                    : "border border-white/15 text-white/55 hover:border-gold/40 hover:text-white"
                }`}>
                {cat}
              </button>
            ))}
          </motion.div>

          {/* Photo grid */}
          <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((photo, i) => (
                <motion.div
                  key={photo.src}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className="relative overflow-hidden rounded-2xl group cursor-pointer"
                  style={{ aspectRatio: "4/3" }}
                  onClick={() => setLightbox(allPhotos.indexOf(photo))}
                >
                  <Image src={photo.src} alt={photo.alt} fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    quality={85} />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="font-sans text-[0.72rem] font-semibold text-white">{photo.caption}</p>
                    <p className="font-sans text-[0.63rem] text-gold-light">{photo.category}</p>
                  </div>
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-gold/40 transition-all duration-300" />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Placeholder notice */}
          <motion.div {...fadeUp(0.3)}
            className="mt-10 rounded-2xl border border-gold/20 bg-gold/[0.05] p-5 text-center">
            <p className="font-sans text-[0.82rem] text-white/60">
              📸 <span className="text-gold-light font-semibold">Photos coming soon</span> — we are building our gallery.
              These are placeholder images. Real photos of our campus, learners, and events will be added shortly.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.92)" }}
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative w-full max-w-3xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: "16/10" }}>
                <Image
                  src={allPhotos[lightbox].src}
                  alt={allPhotos[lightbox].alt}
                  fill
                  className="object-cover"
                  quality={100}
                />
              </div>
              <div className="flex items-center justify-between mt-3 px-1">
                <div>
                  <p className="font-serif text-white font-semibold">{allPhotos[lightbox].caption}</p>
                  <p className="font-sans text-[0.72rem] text-gold-light">{allPhotos[lightbox].category}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setLightbox(l => l! > 0 ? l! - 1 : allPhotos.length - 1)}
                    className="w-9 h-9 rounded-full border border-white/20 text-white/70 hover:border-gold hover:text-gold transition-all flex items-center justify-center text-sm">
                    ‹
                  </button>
                  <button onClick={() => setLightbox(l => l! < allPhotos.length - 1 ? l! + 1 : 0)}
                    className="w-9 h-9 rounded-full border border-white/20 text-white/70 hover:border-gold hover:text-gold transition-all flex items-center justify-center text-sm">
                    ›
                  </button>
                  <button onClick={() => setLightbox(null)}
                    className="w-9 h-9 rounded-full border border-white/20 text-white/70 hover:border-red-400 hover:text-red-400 transition-all flex items-center justify-center text-sm">
                    ✕
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CTA ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-10 text-center"
        style={{ background: "linear-gradient(135deg, #1c3178 0%, #162660 100%)", borderTop: "0.5px solid rgba(255,255,255,0.08)" }}>
        <div className="max-w-xl mx-auto">
          <h2 className="font-serif font-bold mb-3" style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)" }}>
            Come and See for Yourself
          </h2>
          <p className="font-sans text-white/65 mb-8 leading-relaxed" style={{ fontSize: "0.92rem" }}>
            Photos tell part of the story. Visit us in Shamata and experience the Horizon Hope community firsthand.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href={WA_URL} target="_blank" rel="noopener noreferrer">
              <Button variant="primary">💬 WhatsApp Us</Button>
            </a>
            <Link href="/contact"><Button variant="outline">📍 Get Directions</Button></Link>
          </div>
        </div>
      </section>
    </>
  );
}
