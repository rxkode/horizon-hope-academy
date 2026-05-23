import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://horizon-hope-academy.vercel.app";
  const now  = new Date();

  return [
    { url: base,                     lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/about`,          lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/academics`,      lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/admissions`,     lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${base}/student-life`,   lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/gallery`,        lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/faqs`,           lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/careers`,        lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/portal`,         lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contact`,        lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];
}
