import type { Metadata } from "next"
import { Montserrat, Bebas_Neue } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Providers from "@/components/Providers"

const montserrat = Montserrat({ 
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
})

const bebasNeue = Bebas_Neue({ 
  subsets: ["latin"],
  variable: "--font-bebas",
  weight: ["400"],
  display: "swap",
})

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rageroomdirectory.co.uk"

export const metadata: Metadata = {
  title: {
    default: "RageRoom Directory | Find Rage Rooms & Smash Rooms Across the UK",
    template: "%s | RageRoom Directory",
  },
  description:
    "Discover and compare rage rooms and smash rooms across the UK. Browse by city, view prices, packages, opening hours and book your next stress-relief session.",
  metadataBase: new URL(baseUrl),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    title: "RageRoom Directory",
    description:
      "Find the best rage rooms and smash experiences near you in the UK.",
    url: baseUrl,
    siteName: "RageRoom Directory",
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "RageRoom Directory - Find Rage Rooms Across the UK",
      },
    ],
  },
  manifest: "/site.webmanifest",
  twitter: {
    card: "summary_large_image",
    title: "RageRoom Directory",
    description:
      "Discover UK rage rooms, compare packages and book your next smash session.",
    images: [`${baseUrl}/og-image.png`],
  },
} satisfies Metadata

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rageroomdirectory.co.uk"

  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "RageRoom Directory",
    url: baseUrl,
    logo: {
      "@type": "ImageObject",
      url: `${baseUrl}/logo.png`,
      width: 512,
      height: 512,
    },
    sameAs: [
      "https://instagram.com/rageroomdirectory",
      "https://twitter.com/rageroomdirectory",
    ],
  }

  // Website Schema (Sitelinks Search Box)
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/search?query={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <html lang="en-GB">
      <head>
        {/* Organization Schema - JSON-LD in head for optimal SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        
        {/* Website Schema - JSON-LD in head for optimal SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        
        {/* Cloudflare Web Analytics */}
        <script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "96418e10c1f84246b90bd34546f8ca66"}'
        />
        {/* End Cloudflare Web Analytics */}
      </head>
      <body className={`${montserrat.variable} ${bebasNeue.variable} font-sans min-h-screen bg-[#1c1c1c] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.1),#1c1c1c_70%)] text-white flex justify-center px-2 sm:px-4`}>
        <Providers>
          <div className="w-[80%] bg-[#111111] shadow-2xl rounded-lg overflow-hidden border border-zinc-800 px-3 sm:px-6 md:px-10">
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}

