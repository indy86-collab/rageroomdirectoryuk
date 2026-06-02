"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { Menu, X, Search } from "lucide-react"
import Logo from "./Logo"

const navItems = [
  { label: "Home", href: "/" },
  { label: "Find Near Me", href: "/near-me" },
  { label: "Directories", href: "/listings" },
  { label: "City Guides", href: "/guides" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/#faq" },
  { label: "List Your Venue", href: "/list-your-rage-room" },
]

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [headerQuery, setHeaderQuery] = useState("")

  const handleHeaderSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = headerQuery.trim()
    router.push(q ? `/search?query=${encodeURIComponent(q)}` : "/search")
  }

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    if (href.startsWith("/#")) return false
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-dark-900/95 border-b border-zinc-800/70">
      <div className="w-full px-3 sm:px-5 lg:px-6">
        <div className="flex items-center justify-between gap-4 h-16 lg:h-20">
          <div className="flex-shrink-0">
            <Logo />
          </div>

          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-2.5 xl:px-3 py-2 text-[11px] xl:text-xs font-semibold uppercase tracking-[0.14em] transition-colors ${
                    active
                      ? "text-white nav-active-underline"
                      : "text-zinc-300 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <form
              onSubmit={handleHeaderSearch}
              className="flex items-center bg-dark-800 border border-zinc-800 rounded-md overflow-hidden h-10 w-[220px] lg:w-[260px] xl:w-[300px] focus-within:border-rage-500/60 transition-colors"
            >
              <label htmlFor="header-search" className="sr-only">
                Find a Rage Room near you
              </label>
              <input
                id="header-search"
                type="text"
                value={headerQuery}
                onChange={(e) => setHeaderQuery(e.target.value)}
                placeholder="Find a Rage Room near you..."
                className="flex-1 min-w-0 bg-transparent px-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none"
              />
              <button
                type="button"
                aria-label="Use my location"
                onClick={() => router.push("/near-me")}
                className="px-2 text-zinc-400 hover:text-rage-400 transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
              <button
                type="submit"
                className="h-full px-3 lg:px-4 bg-rage-500 hover:bg-rage-600 text-white text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Search
              </button>
            </form>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-zinc-300 hover:text-white hover:bg-rage-500/10 rounded-md transition-all"
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

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-zinc-800/70 py-4 space-y-4">
            <form
              onSubmit={(e) => {
                handleHeaderSearch(e)
                setMobileMenuOpen(false)
              }}
              className="flex items-center bg-dark-800 border border-zinc-800 rounded-md overflow-hidden h-11"
            >
              <input
                type="text"
                value={headerQuery}
                onChange={(e) => setHeaderQuery(e.target.value)}
                placeholder="Find a Rage Room near you..."
                className="flex-1 min-w-0 bg-transparent px-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none"
              />
              <button
                type="submit"
                className="h-full px-4 bg-rage-500 hover:bg-rage-600 text-white text-xs font-bold uppercase tracking-wider"
              >
                Search
              </button>
            </form>

            <nav className="flex flex-col space-y-1">
              {navItems.map((item) => {
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-3 rounded-md text-sm font-semibold uppercase tracking-[0.12em] transition-colors ${
                      active
                        ? "bg-rage-500 text-white"
                        : "text-zinc-300 hover:bg-dark-800 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
