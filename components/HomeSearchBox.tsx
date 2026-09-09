"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { Search } from "lucide-react"
import { isCompleteUkPostcode, normaliseUkPostcode } from "@/lib/uk-postcode"

interface Suggestion {
  type: "city" | "listing"
  label: string
  href: string
  city?: string
}

export default function HomeSearchBox({ initialQuery = "", id = "directory-search", label = "City or postcode", buttonLabel = "Find rooms" }: { initialQuery?: string; id?: string; label?: string; buttonLabel?: string }) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const controller = new AbortController()
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([])
        setShowSuggestions(false)
        return
      }

      try {
        const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`, { signal: controller.signal })
        if (!response.ok) return
        const data = await response.json()
        if (controller.signal.aborted) return

        const allSuggestions: Suggestion[] = [
          ...data.cities,
          ...data.listings,
        ]

        setSuggestions(allSuggestions.slice(0, 8))
        setShowSuggestions(allSuggestions.length > 0 && document.activeElement === inputRef.current)
        setSelectedIndex(-1)
      } catch (error) {
        if (controller.signal.aborted) return
        console.error("Error fetching suggestions:", error)
        setSuggestions([])
        setShowSuggestions(false)
      }
    }

    const debounceTimer = setTimeout(fetchSuggestions, 300)
    return () => { clearTimeout(debounceTimer); controller.abort() }
  }, [query])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      const value = query.trim()
      if (isCompleteUkPostcode(value)) {
        router.push(`/near-me?postcode=${encodeURIComponent(normaliseUkPostcode(value))}`)
      } else {
        router.push(`/search?query=${encodeURIComponent(value)}`)
      }
      setShowSuggestions(false)
    } else {
      router.push("/search")
    }
  }

  const handleSuggestionClick = (suggestion: Suggestion) => {
    router.push(suggestion.href)
    setShowSuggestions(false)
    setQuery("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault()
      handleSuggestionClick(suggestions[selectedIndex])
    } else if (e.key === "Escape") {
      setShowSuggestions(false)
      setSelectedIndex(-1)
    }
  }

  return (
    <div ref={searchRef} className="relative mx-auto max-w-2xl">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
          <div className="relative min-w-0 flex-1">
            <label htmlFor={id} className="sr-only">
              {label}
            </label>
            <input
              id={id}
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.length >= 2 && setShowSuggestions(true)}
              onKeyDown={handleKeyDown}
              placeholder="City or postcode"
              autoComplete="off"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={showSuggestions && suggestions.length > 0}
              aria-controls={`${id}-suggestions`}
              aria-activedescendant={selectedIndex >= 0 && showSuggestions ? `${id}-option-${selectedIndex}` : undefined}
              enterKeyHint="search"
              className="min-h-12 w-full rounded-lg border border-zinc-600 bg-zinc-950/90 px-4 py-3.5 text-base text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500 sm:px-4"
            />

            {showSuggestions && suggestions.length > 0 && (
              <div id={`${id}-suggestions`} role="listbox" aria-label="Search suggestions" className="absolute z-50 mt-2 max-h-64 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-xl sm:max-h-96">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={`${suggestion.type}-${index}`}
                    id={`${id}-option-${index}`}
                    role="option"
                    aria-selected={index === selectedIndex}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`w-full min-h-11 px-4 py-3 text-left transition-colors hover:bg-orange-50 ${
                      index === selectedIndex ? "bg-orange-50" : ""
                    } ${
                      index > 0 ? "border-t border-gray-100" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {suggestion.type === "city" ? (
                        <svg
                          className="h-5 w-5 shrink-0 text-orange-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-5 w-5 shrink-0 text-orange-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      )}
                      <div className="min-w-0">
                        <div className="truncate font-medium text-gray-900">
                          {suggestion.label}
                        </div>
                        {suggestion.type === "listing" && suggestion.city && (
                          <div className="truncate text-sm text-gray-500">
                            {suggestion.city}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-6 py-3.5 text-base font-bold text-white transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900 sm:w-auto sm:px-5"
          >
            <Search className="h-5 w-5 sm:hidden" aria-hidden="true" />
            <span>{buttonLabel}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
