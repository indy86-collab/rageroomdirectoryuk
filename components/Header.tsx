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
    <header className="sticky top-0 z-50 w-full bg-dark-900/80 backdrop-blur-lg border-b border-zinc-800/50 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Brand */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative px-4 py-2 transition-all duration-300"
                >
                  <span
                    className={`text-sm font-semibold transition-colors relative z-10 ${
                      isActive
                        ? "text-rage-500"
                        : "text-zinc-300 group-hover:text-white"
                    }`}
                  >
                    {item.label}
                  </span>
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-rage rounded-full"></div>
                  )}
                  {/* Hover background */}
                  <div className="absolute inset-0 bg-rage-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Link>
              )
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 text-zinc-300 hover:text-white hover:bg-rage-500/10 rounded-lg transition-all"
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
          <nav className="md:hidden border-t border-zinc-800/50 py-4 animate-in slide-in-from-top duration-200">
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`relative px-4 py-3.5 rounded-lg text-base font-semibold transition-all ${
                      isActive
                        ? "bg-gradient-rage text-white shadow-glow"
                        : "text-zinc-300 hover:bg-dark-800 hover:text-white"
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                    )}
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

