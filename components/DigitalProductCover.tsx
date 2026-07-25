import Image from "next/image"

type DigitalProductCoverProps = {
  src: string
  alt: string
  className?: string
  priority?: boolean
}

export default function DigitalProductCover({
  src,
  alt,
  className = "",
  priority = false,
}: DigitalProductCoverProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg border border-zinc-800 bg-[#181818] shadow-2xl shadow-black/40 ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        width={1600}
        height={900}
        priority={priority}
        className="h-auto w-full object-cover"
        sizes="(max-width: 768px) 100vw, 520px"
      />
    </div>
  )
}
