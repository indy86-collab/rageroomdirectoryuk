"use client"

import { useState } from "react"
import Image from "next/image"
import type { CuratedRecommendation } from "@/lib/getyourguide-catalogue"

export default function AffiliateProductImage({ image }: { image: CuratedRecommendation["image"] }) {
  const [failed, setFailed] = useState(false)
  if (!image?.approvedSource || failed) return null
  return <Image src={image.src} alt={image.alt} width={800} height={450} unoptimized loading="lazy"
    onError={() => setFailed(true)} className="mb-3 aspect-video w-full rounded object-cover" />
}
