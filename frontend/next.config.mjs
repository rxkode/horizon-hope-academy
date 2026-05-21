/** @type {import('next').NextConfig} */
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import withPWAInit from '@ducanh2912/next-pwa';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

const withPWA = withPWAInit({
  dest: 'public',                          // SW + workbox files land in /public
  disable: process.env.NODE_ENV === 'development',  // no SW in dev (avoids stale cache hell)
  register: true,                          // auto-register SW on page load
  skipWaiting: true,                       // activate new SW immediately
  cacheOnFrontEndNav: true,                // cache navigations for offline
  aggressiveFrontEndNavCaching: true,      // prefetch linked pages
  reloadOnOnline: true,                    // reload stale offline page when back online
  workboxOptions: {
    disableDevLogs: true,
    // Runtime caching strategy
    runtimeCaching: [
      {
        // Cache Google Fonts
        urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'google-fonts',
          expiration: { maxEntries: 10, maxAgeSeconds: 365 * 24 * 60 * 60 },
        },
      },
      {
        // Cache static assets (logo PNGs, etc.)
        urlPattern: /\/assets\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'static-assets',
          expiration: { maxEntries: 50, maxAgeSeconds: 30 * 24 * 60 * 60 },
        },
      },
      {
        // Cache API health + balance endpoints (short TTL)
        urlPattern: /\/api\/v1\/(health|payments\/balance)/i,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-cache',
          networkTimeoutSeconds: 5,
          expiration: { maxEntries: 20, maxAgeSeconds: 5 * 60 },
        },
      },
      {
        // All other API calls — network only (mutations must not be cached)
        urlPattern: /\/api\/v1\/.*/i,
        handler: 'NetworkOnly',
      },
    ],
  },
});

const nextConfig = {
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [75, 85, 100],
    minimumCacheTTL: 86400,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', port: '', pathname: '/**' },
    ],
  },
  compress: true,
  turbopack: {
    root: __dirname,
  },
};

export default withPWA(nextConfig);
