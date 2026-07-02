import type { Metadata } from "next"
import Script from "next/script"
import { Montserrat, Bebas_Neue } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { absoluteUrl, getSiteUrl } from "@/lib/site-url"

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

const baseUrl = getSiteUrl()

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
  const baseUrl = getSiteUrl()
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  // Organization Schema — expanded with @id, description, areaServed,
  // knowsAbout and contactPoint so Google / LLMs can resolve us as a
  // well-defined editorial entity (not just a website).
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": ["Organization", "NewsMediaOrganization"],
    "@id": `${baseUrl}#organization`,
    name: "RageRoom Directory",
    alternateName: ["Rage Room Directory", "RageRoomDirectory.co.uk"],
    url: baseUrl,
    description:
      "RageRoom Directory is the UK's largest independent directory of rage rooms and smash rooms. We aggregate, verify and compare venues so visitors can find the right destination for stress relief, team building, date nights, birthdays and hen/stag parties.",
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/logo.png"),
      width: 512,
      height: 512,
    },
    image: absoluteUrl("/og-image.png"),
    inLanguage: "en-GB",
    areaServed: {
      "@type": "Country",
      name: "United Kingdom",
    },
    knowsAbout: [
      "rage rooms",
      "smash rooms",
      "anger rooms",
      "break rooms",
      "destruction therapy",
      "stress relief",
      "corporate team building",
      "hen and stag activities",
    ],
    publishingPrinciples: `${baseUrl}/editorial-policy`,
    foundingDate: "2024-01-01",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "editorial",
      url: `${baseUrl}/contact`,
      availableLanguage: ["en-GB"],
    },
    sameAs: [
      "https://instagram.com/rageroomdirectory",
      "https://twitter.com/rageroomdirectory",
    ],
  }

  // WebSite schema with SearchAction (sitelinks search box) + a `publisher`
  // reference back to the Organization @id so Google can unify both entities.
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}#website`,
    url: baseUrl,
    name: "RageRoom Directory",
    description:
      "The UK's largest independent directory of rage rooms and smash rooms.",
    inLanguage: "en-GB",
    publisher: { "@id": `${baseUrl}#organization` },
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
        {/* Preconnect to critical third-party origins so the browser can
            open TCP/TLS connections in parallel with HTML parsing. Saves
            ~100–300ms on first paint for AdSense, Fonts, and Maps. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://googleads.g.doubleclick.net" />
        <link rel="dns-prefetch" href="https://maps.googleapis.com" />
        <link rel="dns-prefetch" href="https://static.cloudflareinsights.com" />

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
      <body className={`${montserrat.variable} ${bebasNeue.variable} font-sans min-h-screen bg-dark-950 text-white scrollbar-rage`}>
        {/* AdSense loader: once globally via next/script (not duplicated in ad
            components). `lazyOnload` defers to browser idle after page load,
            pairing with the IntersectionObserver push in AdsenseInContent so
            above-the-fold content paints without ad-engine contention. */}
        <Script
          id="adsbygoogle-js"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9868896840591922"
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />
        {gaMeasurementId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaMeasurementId}');
              `}
            </Script>
          </>
        )}
        {/* Skip link: becomes visible on keyboard focus. WCAG 2.4.1. */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-orange-500 focus:text-white focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
        >
          Skip to main content
        </a>
        {/* Full-width site shell: no max-width rails, matches reference edge-to-edge look. */}
        <div className="relative w-full bg-dark-900">
            <Header />
            <main id="main-content" role="main" className="min-h-screen">
              {children}
            </main>
          <Footer />
        </div>
        <Analytics />
      </body>
    </html>
  )
}
