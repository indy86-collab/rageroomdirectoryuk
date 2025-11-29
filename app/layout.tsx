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

export const metadata: Metadata = {
  title: {
    default: "RageRoom Directory | Find Rage Rooms & Smash Rooms Across the UK",
    template: "%s | RageRoom Directory",
  },
  description:
    "Discover and compare rage rooms and smash rooms across the UK. Browse by city, view prices, packages, opening hours and book your next stress-relief session.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://rageroomdirectory.co.uk"),
  openGraph: {
    type: "website",
    title: "RageRoom Directory",
    description:
      "Find the best rage rooms and smash experiences near you in the UK.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://rageroomdirectory.co.uk",
    siteName: "RageRoom Directory",
  },
  twitter: {
    card: "summary_large_image",
    title: "RageRoom Directory",
    description:
      "Discover UK rage rooms, compare packages and book your next smash session.",
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
  return (
    <html lang="en-GB">
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

