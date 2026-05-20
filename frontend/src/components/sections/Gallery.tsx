"use client";
/**
 * Gallery component — homepage preview section (6 photos).
 * Full gallery at /gallery.
 *
 * ADDING REAL PHOTOS:
 *   1. Copy your photos to: frontend/public/assets/gallery/
 *   2. Name them: gallery-01.jpg, gallery-02.jpg ... gallery-12.jpg
 *   3. Update the `photos` array below with real captions.
 *   4. Run: npm run build && vercel --prod
 *
 * Placeholder images: Unsplash Source API (free, no attribution required).
 * Replace src strings with "/assets/gallery/gallery-NN.jpg" for real photos.
 */
import { motion } from "framer-motion";
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

// Preview photos shown on homepage (6 of 12 total)
// Replace src with "/assets/gallery/gallery-NN.jpg" when you have real photos
const previewPhotos = [
  { src: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&q=80", alt: "Learners reading in the library", caption: "Reading & Discovery" },
  { src: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80", alt: "Children in a classroom", caption: "CBC Classroom Learning" },
  { src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80", alt: "Children playing football", caption: "Sports & Athletics" },
  { src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80", alt: "Teacher with students", caption: "Personal Attention" },
  { src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80", alt: "Students in computer lab", caption: "Computer & ICT Lab" },
  { src: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&q=80", alt: "School farm and nature", caption: "Agriculture & Environment" },
];

export default function GalleryPreview() {
  return (
    <section id="gallery" className="py-20 px-4 sm:px-6 lg:px-10 bg-navy-mid">
      <div className="max-w-7xl mx-auto">
        <motion.div {...fadeUp()} className="text-center mb-12">
          <SectionLabel center>School Life</SectionLabel>
          <h2 className="font-serif font-bold mb-3" style={{ fontSize: "clamp(2rem,3.5vw,2.9rem)" }}>
            Life at Horizon Hope Academy
          </h2>
          <p className="font-sans font-light text-white/60 max-w-lg mx-auto" style={{ fontSize: "0.91rem" }}>
            A glimpse into the vibrant daily life of our learners — in class, on the field, and beyond.
          </p>
        </motion.div>

        {/* Responsive masonry-style grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
          {previewPhotos.map((photo, i) => (
            <motion.div
              key={i}
              {...fadeUp(i * 0.07)}
              className={`relative overflow-hidden rounded-2xl group cursor-pointer ${
                i === 0 ? "sm:col-span-2 sm:row-span-2" : ""
              }`}
              style={{ aspectRatio: i === 0 ? "16/10" : "4/3" }}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes={i === 0
                  ? "(max-width: 640px) 100vw, 66vw"
                  : "(max-width: 640px) 50vw, 33vw"}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                quality={85}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="font-sans text-[0.75rem] font-semibold text-white">{photo.caption}</p>
              </div>
              {/* Gold border on hover */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-gold/40 transition-all duration-300" />
            </motion.div>
          ))}
        </div>

        <motion.div {...fadeUp(0.4)} className="text-center">
          <Link href="/gallery">
            <Button variant="outline">View Full Gallery →</Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
