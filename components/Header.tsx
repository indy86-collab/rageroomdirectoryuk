"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import Logo from "./Logo"

const navItems = [
  { label: "Home", href: "/" },
  { label: "Prices", href: "/rage-room-prices-uk" },
  { label: "Cities", href: "/listings" },
  { label: "All Listings", href: "/listings" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
]

export default function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="w-full bg-transparent">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Logo />

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center"
                >
                  <span
                    className={`text-sm font-medium px-3 py-1 transition-colors ${
                      isActive
                        ? "text-white"
                        : "text-zinc-300 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </span>
                  <span
                    className={`mt-1 h-0.5 rounded-full transition-all ${
                      isActive
                        ? "w-6 bg-orange-500"
                        : "w-0 bg-transparent"
                    }`}
                  />
                </Link>
              )
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-zinc-300 hover:text-white transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-zinc-800 mt-2 pt-4 pb-4">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-md text-base font-medium transition-colors ${
                      isActive
                        ? "bg-orange-500/20 text-orange-500"
                        : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

