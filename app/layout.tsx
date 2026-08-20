import type { Metadata } from "next"
import { Montserrat, Bebas_Neue } from "next/font/google"
import "./globals.css"
import { absoluteUrl, getSiteUrl } from "@/lib/site-url"
import ConsentManager from "@/components/ConsentManager"

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
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    title: "RageRoom Directory",
    description: "Find the best rage rooms and smash experiences near you in the UK.",
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
  viewportFit: "cover" as const,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const siteUrl = getSiteUrl()
  const gaMeasurementId =
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-ZZCN6PNKYW"

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": ["Organization", "NewsMediaOrganization"],
    "@id": `${siteUrl}#organization`,
    name: "RageRoom Directory",
    alternateName: ["Rage Room Directory", "RageRoomDirectory.co.uk"],
    url: siteUrl,
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
    publishingPrinciples: `${siteUrl}/editorial-policy`,
    foundingDate: "2024-01-01",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "editorial",
      url: `${siteUrl}/contact`,
      availableLanguage: ["en-GB"],
    },
    sameAs: [
      "https://instagram.com/rageroomdirectory",
      "https://twitter.com/rageroomdirectory",
    ],
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}#website`,
    url: siteUrl,
    name: "RageRoom Directory",
    description:
      "The UK's largest independent directory of rage rooms and smash rooms.",
    inLanguage: "en-GB",
    publisher: { "@id": `${siteUrl}#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/search?query={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <html lang="en-GB">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body
        className={`${montserrat.variable} ${bebasNeue.variable} font-sans min-h-screen bg-dark-950 text-white scrollbar-rage`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-orange-500 focus:text-white focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
        >
          Skip to main content
        </a>
        {children}
        <ConsentManager
          gaMeasurementId={gaMeasurementId}
          cloudflareToken="96418e10c1f84246b90bd34546f8ca66"
        />
      </body>
    </html>
  )
}
