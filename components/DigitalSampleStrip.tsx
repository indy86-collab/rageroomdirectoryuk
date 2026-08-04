import Image from "next/image"
import Link from "next/link"

type DigitalSampleStripProps = {
  images: string[]
  productName: string
  previewPdf?: string
  className?: string
}

export default function DigitalSampleStrip({
  images,
  productName,
  previewPdf,
  className = "",
}: DigitalSampleStripProps) {
  if (!images.length) {
    return null
  }

  return (
    <div className={className}>
      <h2 className="text-sm font-bold uppercase tracking-widest text-rage-500">
        Peek inside
      </h2>
      <p className="mt-1 text-sm text-zinc-400">
        Sample pages from {productName} — not the full download.
      </p>
      <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
        {images.slice(0, 3).map((src, index) => (
          <div
            key={src}
            className="overflow-hidden rounded-md border border-zinc-700 bg-white shadow-lg shadow-black/30"
          >
            <Image
              src={src}
              alt={`${productName} sample page ${index + 1}`}
              width={1080}
              height={1528}
              className="h-auto w-full bg-white object-contain"
              sizes="(max-width: 768px) 30vw, 180px"
            />
          </div>
        ))}
      </div>
      {previewPdf && (
        <Link
          href={previewPdf}
          className="mt-4 inline-flex text-sm font-semibold text-rage-500 hover:text-rage-400"
        >
          View full sample PDF
        </Link>
      )}
    </div>
  )
}
