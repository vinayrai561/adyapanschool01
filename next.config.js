/** @type {import('next').NextConfig} */
const nextConfig = {
  // ─── Core ────────────────────────────────────────────────────────────────
  reactStrictMode: true,
  // SWC minification is always on in Next.js 15+. No flag needed.

  // ─── Image optimisation ──────────────────────────────────────────────────
  images: {
    // remotePatterns replaces the deprecated `domains` array.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      // QR code generation services for UPI payment QR
      {
        protocol: 'https',
        hostname: 'api.qrserver.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'chart.googleapis.com',
        pathname: '/**',
      },
    ],
    // Serve AVIF first (30-50% smaller), fall back to WebP automatically.
    formats: ['image/avif', 'image/webp'],
    // Cache course/marketing images for 7 days at the CDN edge.
    minimumCacheTTL: 60 * 60 * 24 * 7,
    // Breakpoints aligned with Tailwind defaults used in the project.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // ─── Bundle size optimisation ─────────────────────────────────────────────
  // lucide-react v0.309 ships a single ESM barrel — Turbopack tree-shakes it
  // automatically. A modularizeImports entry with a kebab-case transform breaks
  // named imports (AlertCircle → alert-circle mismatch), so we omit it.
  // date-fns v3 ships individual ESM modules; the transform below is safe.
  modularizeImports: {
    'date-fns': {
      transform: 'date-fns/{{member}}',
    },
  },

  // ─── Security headers ────────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Prevent clickjacking.
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          // Stop MIME-type sniffing.
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Limit referrer leakage while keeping analytics intact.
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Legacy XSS filter for older browsers.
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          // Disable browser features Adyapan doesn't use.
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          // Enable HSTS once your HTTPS setup is permanent:
          // { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        ],
      },
    ];
  },

  // ─── Turbopack compatibility ──────────────────────────────────────────────
  // No webpack overrides → Turbopack works out of the box.
  // Run with: next dev --turbo
};

module.exports = nextConfig;
