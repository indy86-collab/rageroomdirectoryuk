"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ChevronDown, Menu, Search, X } from "lucide-react"
import Logo from "./Logo"

interface NavItem {
  label: string
  href: string
  children?: Array<{ label: string; href: string }>
}

const navItems: NavItem[] = [
  { label: "Find a Rage Room", href: "/listings" },
  {
    label: "Activities",
    href: "/activities",
    children: [
      { label: "Rage Rooms", href: "/activities/rage-rooms" },
      { label: "Axe Throwing", href: "/activities/axe-throwing" },
      { label: "Paint Rooms", href: "/activities/paint-splatter" },
      { label: "Escape Rooms", href: "/activities/escape-rooms" },
    ],
  },
  {
    label: "Occasions",
    href: "/occasions",
    children: [
      { label: "Birthdays", href: "/occasions/birthdays" },
      { label: "Stag Parties", href: "/occasions/stag-parties" },
      { label: "Hen Parties", href: "/occasions/hen-parties" },
      { label: "Corporate", href: "/occasions/corporate-team-building" },
      { label: "Date Night", href: "/occasions/date-night" },
      { label: "Families", href: "/occasions/kids-families" },
    ],
  },
  { label: "Cities", href: "/uk-map" },
  { label: "Guides", href: "/guides" },
  { label: "For Venue Owners", href: "/list-your-rage-room" },
]

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [headerQuery, setHeaderQuery] = useState("")

  const handleHeaderSearch = (event: React.FormEvent) => {
    event.preventDefault()
    const query = headerQuery.trim()
    router.push(query ? `/search?query=${encodeURIComponent(query)}` : "/search")
    setMobileMenuOpen(false)
  }

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    const pathOnly = href.split("?")[0]
    return pathname === pathOnly || pathname.startsWith(`${pathOnly}/`)
  }

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!mobileMenuOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileMenuOpen(false)
    }

    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [mobileMenuOpen])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/70 bg-dark-900/95 pt-[env(safe-area-inset-top)]">
      <div className="w-full px-3 sm:px-5 lg:px-6">
        <div className="flex h-14 items-center gap-2 sm:h-16 sm:gap-4 lg:h-20">
          <div className="shrink-0"><Logo /></div>

          <nav className="hidden min-w-0 flex-1 items-center gap-0.5 lg:flex" aria-label="Main navigation">
            {navItems.map((item) => {
              const active = isActive(item.href)
              return (
                <div key={item.href} className="group relative">
                  <Link
                    href={item.href}
                    className={`relative flex min-h-11 items-center gap-1 px-2 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors xl:px-2.5 xl:text-[11px] ${active ? "nav-active-underline text-white" : "text-zinc-300 hover:text-white"}`}
                  >
                    {item.label}
                    {item.children && <ChevronDown className="h-3 w-3" aria-hidden="true" />}
                  </Link>
                  {item.children && (
                    <div className="invisible absolute left-0 top-full min-w-52 translate-y-1 rounded-md border border-zinc-700 bg-dark-900 p-2 opacity-0 shadow-2xl transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                      {item.children.map((child) => (
                        <Link key={child.href + child.label} href={child.href} className="block rounded px-3 py-2.5 text-sm font-semibold text-zinc-300 hover:bg-dark-800 hover:text-rage-400">
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>

          <form
            onSubmit={handleHeaderSearch}
            className="flex h-11 min-w-0 flex-1 items-center overflow-hidden rounded-md border border-zinc-800 bg-dark-800 transition-colors focus-within:border-rage-500/60 lg:flex-none lg:w-[210px] xl:w-[280px]"
          >
            <label htmlFor="header-search" className="sr-only">Find a Rage Room near you</label>
            <input
              id="header-search"
              type="search"
              value={headerQuery}
              onChange={(event) => setHeaderQuery(event.target.value)}
              placeholder="Town or postcode"
              autoComplete="off"
              enterKeyHint="search"
              className="min-w-0 flex-1 bg-transparent px-3 text-base text-white placeholder:text-zinc-500 focus:outline-none"
            />
            <button type="submit" aria-label="Search" className="inline-flex h-full min-w-11 items-center justify-center bg-rage-500 px-3 text-white transition-colors hover:bg-rage-600">
              <Search className="h-4 w-4" />
            </button>
          </form>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-zinc-300 transition-all hover:bg-rage-500/10 hover:text-white lg:hidden"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div
            id="mobile-navigation"
            className="max-h-[calc(100dvh-3.5rem-env(safe-area-inset-top))] overflow-y-auto border-t border-zinc-800/70 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 lg:hidden"
          >
            <nav className="flex flex-col space-y-1" aria-label="Mobile navigation">
              {navItems.map((item) => (
                <div key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex min-h-11 items-center rounded-md px-3 py-3 text-sm font-semibold uppercase tracking-[0.12em] transition-colors ${isActive(item.href) ? "bg-rage-500 text-white" : "text-zinc-300 hover:bg-dark-800 hover:text-white"}`}
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <div className="ml-3 border-l border-zinc-800 py-1 pl-3">
                      {item.children.map((child) => (
                        <Link
                          key={child.href + child.label}
                          href={child.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex min-h-11 items-center py-2 text-sm text-zinc-400 hover:text-rage-400"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
