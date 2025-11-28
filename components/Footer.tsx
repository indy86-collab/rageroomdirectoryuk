import Link from "next/link"

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="w-full bg-transparent py-6 sm:py-4">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col gap-6">
          {/* Links */}
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

          {/* Fun Copyright Message */}
          <div className="text-center text-xs text-zinc-500 pt-2 border-t border-zinc-800">
            <p>
              © {currentYear} RageRoom Directory. All rights reserved. 
              <span className="ml-2">Smash responsibly, rage safely! 🔨</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

