import Link from "next/link"
import { Twitter, Instagram, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full bg-transparent py-6 sm:py-4">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-4">
          {/* Left links */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 text-xs">
            <Link href="/about" className="text-zinc-500 hover:text-white transition-colors py-1">
              About Us
            </Link>
            <Link href="/contact" className="text-zinc-500 hover:text-white transition-colors py-1">
              Contact
            </Link>
            <Link href="/privacy" className="text-zinc-500 hover:text-white transition-colors py-1">
              Privacy
            </Link>
            <Link href="/terms" className="text-zinc-500 hover:text-white transition-colors py-1">
              Terms
            </Link>
            <Link href="/disclaimer" className="text-zinc-500 hover:text-white transition-colors py-1">
              Disclaimer
            </Link>
            <Link href="/blog" className="text-zinc-500 hover:text-white transition-colors py-1">
              Blog
            </Link>
            <Link href="/list-your-rage-room" className="text-zinc-500 hover:text-white transition-colors py-1">
              List Your Rage Room
            </Link>
          </div>

          {/* Right-aligned social icons */}
          <div className="flex items-center gap-4">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-white transition-colors p-2 -m-2"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-white transition-colors p-2 -m-2"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-white transition-colors p-2 -m-2"
              aria-label="YouTube"
            >
              <Youtube className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

