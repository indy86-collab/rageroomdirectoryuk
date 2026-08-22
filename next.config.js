/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      "/download/[token]": [
        "./private/digital-downloads/rage-room-party-planner-pack.pdf",
        "./private/digital-downloads/corporate-rage-room-team-building-toolkit.pdf",
        "./private/digital-downloads/rage-room-first-visit-prep-pack.pdf",
        "./private/digital-downloads/rage-room-first-timer-checklist.pdf",
        "./private/digital-downloads/rage-room-gift-voucher-template-pack.zip",
      ],
    },
  },
  async headers() {
    return [
      {
        source: "/rage-reset-sw.js",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/rage-reset" },
        ],
      },
      {
        source: "/rage-reset.webmanifest",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
        ],
      },
    ]
  },
  async redirects() {
    return [
      // Canonicalise the apex host in one permanent hop. Keep the matching
      // Vercel domain redirect set to 308 as well so the edge and app agree.
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'rageroomdirectory.co.uk' }],
        destination: 'https://www.rageroomdirectory.co.uk/:path*',
        permanent: true,
      },
      // Consolidate the non-UK variant to the canonical UK guide to avoid
      // splitting link equity across two near-duplicate URLs.
      {
        source: '/guides/rage-rooms-for-birthdays',
        destination: '/guides/rage-rooms-for-birthdays-uk',
        permanent: true,
      },
      // "Rage room London" should rank on the editorial best-of guide.
      // /city/london remains the inventory list; this landing is the duplicate.
      {
        source: '/rage-room-london',
        destination: '/guides/best-rage-rooms-london',
        permanent: true,
      },
      {
        source: '/rage-room-manchester',
        destination: '/guides/best-rage-rooms-manchester',
        permanent: true,
      },
      // Listings use city "Newcastle"; collapse the long-form slug duplicate.
      {
        source: '/city/newcastle-upon-tyne',
        destination: '/city/newcastle',
        permanent: true,
      },
      {
        source: '/rage-room-prices/newcastle-upon-tyne',
        destination: '/rage-room-prices/newcastle',
        permanent: true,
      },
    ]
  },
  images: {
    // Modern formats first; Next/Image will negotiate via Accept headers.
    formats: ['image/avif', 'image/webp'],
    // Broad allowlist so any listing/Google Places/CDN image renders optimised.
    remotePatterns: [
      { protocol: 'https', hostname: 'storage.googleapis.com', pathname: '/**' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com', pathname: '/**' },
      { protocol: 'https', hostname: 'lh4.googleusercontent.com', pathname: '/**' },
      { protocol: 'https', hostname: 'lh5.googleusercontent.com', pathname: '/**' },
      { protocol: 'https', hostname: 'lh6.googleusercontent.com', pathname: '/**' },
      { protocol: 'https', hostname: 'maps.googleapis.com', pathname: '/**' },
      { protocol: 'https', hostname: 'maps.gstatic.com', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
      { protocol: 'https', hostname: 'cdn.rageroomdirectory.co.uk', pathname: '/**' },
      { protocol: 'https', hostname: '**.supabase.co', pathname: '/**' },
      { protocol: 'https', hostname: '**.supabase.in', pathname: '/**' },
    ],
    deviceSizes: [360, 640, 750, 828, 1080, 1200, 1440, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
}

module.exports = nextConfig
