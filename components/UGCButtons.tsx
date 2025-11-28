"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, AlertTriangle } from "lucide-react"

interface UGCButtonsProps {
  listingId?: string
  listingName?: string
}

export default function UGCButtons({ listingId, listingName }: UGCButtonsProps) {
  const [showSuggestForm, setShowSuggestForm] = useState(false)
  const [showReportForm, setShowReportForm] = useState(false)

  return (
    <div className="bg-[#181818] rounded-lg border border-zinc-800 p-4 sm:p-6 mb-6 sm:mb-8">
      <h2 className="text-lg sm:text-xl font-bold text-white mb-4">
        Help Us Improve
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <Link
          href="/list-your-rage-room"
          className="flex items-start sm:items-center gap-3 p-4 bg-zinc-900 hover:bg-zinc-800 rounded-lg border border-zinc-700 transition-colors group min-h-[80px] sm:min-h-0"
        >
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center group-hover:bg-orange-500/30 transition-colors">
            <Plus className="w-5 h-5 text-orange-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold mb-1 text-sm sm:text-base">Suggest a Rage Room</h3>
            <p className="text-zinc-400 text-xs sm:text-sm">Know a venue we're missing? Let us know!</p>
          </div>
        </Link>

        <a
          href={`mailto:ukrageroom@gmail.com?subject=Report Incorrect Information${listingName ? ` - ${listingName}` : ''}&body=${listingId ? `Listing ID: ${listingId}\n\n` : ''}Please describe what information is incorrect:`}
          className="flex items-start sm:items-center gap-3 p-4 bg-zinc-900 hover:bg-zinc-800 rounded-lg border border-zinc-700 transition-colors group min-h-[80px] sm:min-h-0"
        >
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center group-hover:bg-orange-500/30 transition-colors">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold mb-1 text-sm sm:text-base">Report Incorrect Information</h3>
            <p className="text-zinc-400 text-xs sm:text-sm">Found something wrong? Help us fix it.</p>
          </div>
        </a>
      </div>
    </div>
  )
}

