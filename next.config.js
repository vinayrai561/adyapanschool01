/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://challenges.cloudflare.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://api.razorpay.com https://*.mongodb.net https://challenges.cloudflare.com",
      "frame-src https://api.razorpay.com https://checkout.razorpay.com https://challenges.cloudflare.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
    ].join('; '),
  },
  ...(process.env.NODE_ENV === 'production' ? [
    { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  ] : []),
];

const nextConfig = {
  // ─── Core ────────────────────────────────────────────────────────────────
  reactStrictMode: true,
  devIndicators:   false,
  transpilePackages: ['axios'],

  // ─── Production output ───────────────────────────────────────────────────
  // 'standalone' bundles only what's needed — ideal for Docker / Render
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,

  // ─── Image optimisation ──────────────────────────────────────────────────
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com',    pathname: '/**' },
      { protocol: 'https', hostname: 'api.qrserver.com',       pathname: '/**' },
      { protocol: 'https', hostname: 'chart.googleapis.com',   pathname: '/**' },
      { protocol: 'https', hostname: 'res.cloudinary.com',     pathname: '/**' },
      { protocol: 'https', hostname: 'upload.wikimedia.org',   pathname: '/**' },
      { protocol: 'https', hostname: 'videos.pexels.com',      pathname: '/**' },
    ],
    formats:          ['image/avif', 'image/webp'],
    minimumCacheTTL:  60 * 60 * 24 * 7,   // 7 days
    deviceSizes:      [640, 750, 828, 1080, 1200, 1920],
    imageSizes:       [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: false,
  },

  // ─── Bundle optimisation ─────────────────────────────────────────────────
  modularizeImports: {
    'date-fns': { transform: 'date-fns/{{member}}' },
    // NOTE: lucide-react v0.309+ ships a single ESM barrel that Turbopack
    // tree-shakes automatically. A modularizeImports transform breaks named
    // imports under Turbopack (Search → search mismatch), so we omit it.
  },

  // ─── Compiler optimisations ──────────────────────────────────────────────
  compiler: {
    // Remove console.log in production (keep warn/error)
    removeConsole: process.env.NODE_ENV === 'production'
      ? { exclude: ['error', 'warn'] }
      : false,
  },

  // ─── Turbopack configuration (moved out of experimental in Next.js 16) ──
  turbopack: {
    // Turbopack is the default bundler in Next.js 16
  },

  // ─── Experimental performance features ───────────────────────────────────
  experimental: {
    optimizePackageImports: ['framer-motion', 'recharts'],
  },

  // ─── Security headers ────────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      // Cache static assets aggressively
      {
        source: '/course-thumbnails/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
        ],
      },
    ];
  },

  // ─── Redirects ───────────────────────────────────────────────────────────
  async redirects() {
    return [
      // Redirect old /offline-service (singular) to /offline-services
      {
        source:      '/offline-service',
        destination: '/offline-services',
        permanent:   true,
      },
      // WWW → non-WWW canonical redirect (production only)
      ...(process.env.NODE_ENV === 'production' ? [
        {
          source:      '/:path*',
          has:         [{ type: 'host', value: 'www.adyapan.com' }],
          destination: 'https://adyapan.com/:path*',
          permanent:   true,
        },
      ] : []),
    ];
  },
};

module.exports = nextConfig;
