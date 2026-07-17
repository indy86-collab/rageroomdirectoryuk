/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      "/download/[token]": [
        "./private/digital-downloads/rage-room-party-planner-pack.pdf",
        "./private/digital-downloads/corporate-rage-room-team-building-toolkit.pdf",
        "./private/digital-downloads/rage-room-first-visit-prep-pack.pdf",
        "./private/digital-downloads/rage-room-gift-voucher-template-pack.zip",
      ],
    },
  },
  async redirects() {
    return [
      // Consolidate the non-UK variant to the canonical UK guide to avoid
      // splitting link equity across two near-duplicate URLs.
      {
        source: '/guides/rage-rooms-for-birthdays',
        destination: '/guides/rage-rooms-for-birthdays-uk',
        permanent: true,
      },
      // London hub/spoke: /city/london is primary; keyword landing redirects.
      {
        source: '/rage-room-london',
        destination: '/city/london',
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
