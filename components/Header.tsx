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
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-soft">
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
                        ? "text-primary-600"
                        : "text-gray-600 group-hover:text-gray-900"
                    }`}
                  >
                    {item.label}
                  </span>
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-primary rounded-full"></div>
                  )}
                  {/* Hover background */}
                  <div className="absolute inset-0 bg-primary-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Link>
              )
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 text-gray-600 hover:text-gray-900 hover:bg-primary-50 rounded-lg transition-all"
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
          <nav className="md:hidden border-t border-gray-200 py-4 bg-white">
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
                        ? "bg-primary-600 text-white shadow-primary"
                        : "text-gray-700 hover:bg-gray-100"
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

