import type { Metadata, Viewport } from "next"
import { RageResetShell } from "@/components/rage-reset/RageResetShell"
import { RageResetPwa } from "@/components/rage-reset/RageResetPwa"
import { absoluteUrl } from "@/lib/site-url"

const title = "Rage Reset – Free Three-Minute Smash Game"
const description =
  "Play a free mobile smash game, control your strikes, complete a calming challenge and check how you feel afterwards. Entertainment only, not therapy."

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/rage-reset",
  },
  manifest: "/rage-reset.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Rage Reset",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title,
    description,
    url: "/rage-reset",
    type: "website",
    images: [
      {
        url: absoluteUrl("/rage-reset/icons/icon-512.png"),
        width: 512,
        height: 512,
        alt: "Rage Reset",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [absoluteUrl("/rage-reset/icons/icon-512.png")],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0A0A0A",
}

const gameJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Rage Reset",
  applicationCategory: "GameApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "GBP",
  },
  description,
  url: absoluteUrl("/rage-reset"),
  isAccessibleForFree: true,
}

export default function RageResetPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gameJsonLd) }}
      />
      <RageResetPwa />
      <RageResetShell />
    </>
  )
}
