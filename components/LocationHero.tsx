import Image from "next/image"

export default function LocationHero({
  city,
  image,
}: {
  city: string
  image: string
}) {
  return (
    <div className="relative mb-6 overflow-hidden rounded-lg border border-zinc-800 aspect-[21/9] min-h-[180px] sm:min-h-[240px] bg-zinc-900">
      <Image
        src={image}
        alt={`${city} skyline`}
        fill
        priority
        sizes="(max-width: 1024px) 100vw, 1152px"
        className="object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10"
      />
    </div>
  )
}
