import TrackedBookingLink from "./TrackedBookingLink"
import TrackedPhoneLink from "./TrackedPhoneLink"

type ListingStickyBookingBarProps = {
  venueSlug: string
  venueCity: string
  venueName: string
  bookingUrl: string | null
  phone: string | null
  priceLabel: string | null
}

export default function ListingStickyBookingBar({
  venueSlug,
  venueCity,
  venueName,
  bookingUrl,
  phone,
  priceLabel,
}: ListingStickyBookingBarProps) {
  if (!bookingUrl && !phone) return null

  return (
    <>
      <div className="h-20 lg:hidden" aria-hidden />
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-800 bg-dark-900/95 px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-2">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-white">{venueName}</p>
            {priceLabel ? (
              <p className="truncate text-xs font-semibold text-rage-400">{priceLabel}</p>
            ) : (
              <p className="truncate text-xs text-zinc-500">Check current availability</p>
            )}
          </div>
          {phone && (
            <TrackedPhoneLink
              href={`tel:${phone}` as `tel:${string}`}
              venueSlug={venueSlug}
              venueCity={venueCity}
              context={{ pageType: "venue" }}
              ctaPlacement="venue_sticky"
              className={`inline-flex min-h-11 items-center justify-center rounded-md border border-zinc-700 px-4 text-sm font-bold text-white hover:border-zinc-500 ${bookingUrl ? "shrink-0" : "flex-1"}`}
            >
              Call
            </TrackedPhoneLink>
          )}
          {bookingUrl && (
            <TrackedBookingLink
              href={bookingUrl}
              venueSlug={venueSlug}
              venueCity={venueCity}
              context={{ pageType: "venue" }}
              ctaPlacement="venue_sticky"
              className="inline-flex min-h-11 min-w-[8.5rem] flex-1 items-center justify-center rounded-md bg-rage-500 px-4 text-sm font-bold text-white hover:bg-rage-600"
            >
              Book now
            </TrackedBookingLink>
          )}
        </div>
      </div>
    </>
  )
}
