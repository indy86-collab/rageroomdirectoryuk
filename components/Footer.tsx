import Link from "next/link"
import Logo from "./Logo"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const columns: { heading: string; links: { label: string; href: string }[] }[] = [
    {
      heading: "Links",
      links: [
        { label: "About", href: "/about" },
        { label: "Terms", href: "/terms" },
      ],
    },
    {
      heading: "Contact",
      links: [
        { label: "Contact", href: "/contact" },
        { label: "Privacy", href: "/privacy-policy" },
      ],
    },
    {
      heading: "Careers",
      links: [
        { label: "Careers", href: "/list-your-rage-room" },
        { label: "FAQ", href: "/#faq" },
      ],
    },
  ]

  return (
    <footer className="w-full bg-[#0a0a0a] border-t border-zinc-800/80 mt-16">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 text-sm text-zinc-400 max-w-sm leading-relaxed">
              The UK&rsquo;s leading directory for rage rooms and smash experiences. Compare venues, view prices and book with confidence.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.heading}>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-3">
                {col.heading}
              </h3>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-400 hover:text-rage-500 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-zinc-800/70 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-zinc-500">
            © {currentYear} RageRoom Directory. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500">
            <Link href="/privacy-policy" className="hover:text-rage-500 transition-colors">
              Privacy
            </Link>
            <span className="text-zinc-700">·</span>
            <Link href="/terms" className="hover:text-rage-500 transition-colors">
              Terms
            </Link>
            <span className="text-zinc-700">·</span>
            <Link href="/disclaimer" className="hover:text-rage-500 transition-colors">
              Disclaimer
            </Link>
            <span className="text-zinc-700">·</span>
            <Link href="/editorial-policy" className="hover:text-rage-500 transition-colors">
              Editorial
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
