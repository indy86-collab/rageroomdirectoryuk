import Link from "next/link"

/**
 * RRD wordmark logo (matches reference design):
 * large orange "RRD" letters sit next to a stacked "RAGE ROOM / DIRECTORY.CO.UK" label.
 * Pure typography + SVG — no external image dependency.
 */
export default function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-3 group select-none"
      aria-label="RageRoom Directory home"
    >
      {/* RRD mark. Uses the display (Bebas) font so the letters look condensed + bold. */}
      <span
        aria-hidden="true"
        className="font-display text-[32px] sm:text-[44px] leading-none tracking-tight text-rage-500 group-hover:text-rage-400 transition-colors"
        style={{ fontFamily: "var(--font-bebas), 'Bebas Neue', Impact, sans-serif" }}
      >
        RRD
      </span>

      {/* Stacked wordmark — hidden on very small screens to keep header tight. */}
      <span className="hidden sm:flex flex-col leading-[1.05]">
        <span className="text-[13px] sm:text-[15px] font-extrabold tracking-wide text-white uppercase">
          Rage Room
        </span>
        <span className="text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-[0.22em]">
          Directory.co.uk
        </span>
      </span>
    </Link>
  )
}
