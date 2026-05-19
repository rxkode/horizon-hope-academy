/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimisation — Next.js built-in
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400,
    // Prevent Next.js from touching our immutable logo assets
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Compression
  compress: true,

  // Strict TypeScript + ESLint in CI
  typescript: { ignoreBuildErrors: false },
  eslint:     { ignoreDuringBuilds: false },

  // Security headers applied in vercel.json
};

export default nextConfig;
