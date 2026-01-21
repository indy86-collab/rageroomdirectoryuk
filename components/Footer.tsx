import Link from "next/link"
import { Zap } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="w-full bg-gradient-to-b from-transparent to-dark-950/50 border-t border-zinc-800/50 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        {/* Top section with logo and tagline */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-rage-500" fill="currentColor" />
            <span className="text-xl font-bold text-gradient">RageRoom Directory</span>
          </div>
          <p className="text-sm text-zinc-400 max-w-md mx-auto">
            The UK's leading platform for discovering and comparing rage rooms and smash experiences.
          </p>
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div>
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Explore</h3>
            <div className="flex flex-col gap-2">
              <Link href="/listings" className="text-sm text-zinc-500 hover:text-rage-500 transition-colors">
                All Listings
              </Link>
              <Link href="/near-me" className="text-sm text-zinc-500 hover:text-rage-500 transition-colors">
                Near Me
              </Link>
              <Link href="/guides" className="text-sm text-zinc-500 hover:text-rage-500 transition-colors">
                Guides
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Company</h3>
            <div className="flex flex-col gap-2">
              <Link href="/about" className="text-sm text-zinc-500 hover:text-rage-500 transition-colors">
                About Us
              </Link>
              <Link href="/blog" className="text-sm text-zinc-500 hover:text-rage-500 transition-colors">
                Blog
              </Link>
              <Link href="/contact" className="text-sm text-zinc-500 hover:text-rage-500 transition-colors">
                Contact
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Resources</h3>
            <div className="flex flex-col gap-2">
              <Link href="/rage-room-prices-uk" className="text-sm text-zinc-500 hover:text-rage-500 transition-colors">
                Prices
              </Link>
              <Link href="/guides" className="text-sm text-zinc-500 hover:text-rage-500 transition-colors">
                Safety Guide
              </Link>
              <Link href="/list-your-rage-room" className="text-sm text-zinc-500 hover:text-rage-500 transition-colors">
                List Your Venue
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Legal</h3>
            <div className="flex flex-col gap-2">
              <Link href="/privacy-policy" className="text-sm text-zinc-500 hover:text-rage-500 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-zinc-500 hover:text-rage-500 transition-colors">
                Terms
              </Link>
              <Link href="/disclaimer" className="text-sm text-zinc-500 hover:text-rage-500 transition-colors">
                Disclaimer
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="pt-8 border-t border-zinc-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-500 text-center sm:text-left">
            © {currentYear} RageRoom Directory. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-zinc-600">Smash responsibly,</span>
            <span className="text-rage-500 font-semibold">rage safely!</span>
            <span className="text-rage-500">🔨</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

