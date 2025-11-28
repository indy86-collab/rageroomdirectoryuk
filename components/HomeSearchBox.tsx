"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"

interface Suggestion {
  type: "city" | "listing"
  label: string
  href: string
  city?: string
}

export default function HomeSearchBox() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([])
        setShowSuggestions(false)
        return
      }

      try {
        const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`)
        const data = await response.json()
        
        const allSuggestions: Suggestion[] = [
          ...data.cities,
          ...data.listings,
        ]
        
        setSuggestions(allSuggestions.slice(0, 8)) // Limit to 8 total suggestions
        setShowSuggestions(allSuggestions.length > 0)
        setSelectedIndex(-1)
      } catch (error) {
        console.error("Error fetching suggestions:", error)
        setSuggestions([])
        setShowSuggestions(false)
      }
    }

    const debounceTimer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounceTimer)
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
      router.push(`/search?query=${encodeURIComponent(query.trim())}`)
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
    <div ref={searchRef} className="max-w-2xl mx-auto relative">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3 items-center">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.length >= 2 && setShowSuggestions(true)}
              onKeyDown={handleKeyDown}
              placeholder="City or Postcode"
              className="w-full px-4 sm:px-6 py-3.5 sm:py-4 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 text-base sm:text-lg min-h-[44px]"
            />
            
            {/* Autocomplete Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={`${suggestion.type}-${index}`}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`w-full text-left px-4 py-3 hover:bg-orange-50 transition-colors ${
                      index === selectedIndex ? "bg-orange-50" : ""
                    } ${
                      index > 0 ? "border-t border-gray-100" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {suggestion.type === "city" ? (
                        <svg
                          className="w-5 h-5 text-orange-500"
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
                          className="w-5 h-5 text-orange-500"
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
                      <div>
                        <div className="font-medium text-gray-900">
                          {suggestion.label}
                        </div>
                        {suggestion.type === "listing" && suggestion.city && (
                          <div className="text-sm text-gray-500">
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
            className="px-8 py-4 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors text-lg"
          >
            FIND YOUR RAGE
          </button>
          <svg
            className="w-6 h-6 text-white cursor-pointer"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            onClick={handleSubmit}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </form>
    </div>
  )
}




