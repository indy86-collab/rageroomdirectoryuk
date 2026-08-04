import type { ListingMedia } from "@/types/listing"

export default function ListingMediaGallery({
  media,
  venueName,
}: {
  media: ListingMedia[]
  venueName: string
}) {
  if (!media.length) return null

  return (
    <section className="mb-6 rounded-lg border border-zinc-800 bg-[#181818] p-4 sm:mb-8 sm:p-6">
      <h2 className="mb-4 text-xl font-bold text-white sm:text-2xl">
        Photos and videos from {venueName}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {media.map((item, index) => (
          <figure key={`${item.url}-${index}`} className="overflow-hidden rounded-lg border border-zinc-700 bg-zinc-950">
            {item.type === "image" ? (
              // Authorised media may arrive from venue CDNs not known at build time.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.url}
                alt={item.alt}
                width={item.width || 1200}
                height={item.height || 675}
                loading="lazy"
                className="aspect-video h-auto w-full object-cover"
              />
            ) : (
              <video
                controls
                preload="metadata"
                poster={item.thumbnailUrl || undefined}
                aria-label={item.alt}
                className="aspect-video w-full bg-black"
              >
                <source src={item.url} />
                Your browser does not support embedded video.
              </video>
            )}
            <figcaption className="p-3 text-sm text-zinc-300">
              <p>{item.caption || item.alt}</p>
              {item.credit && <p className="mt-1 text-xs text-zinc-500">Credit: {item.credit}</p>}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
