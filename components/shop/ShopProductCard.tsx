"use client"
import Image from "next/image"
import { useState } from "react"
import { type ShopProduct, SHIPPING_PER_ITEM, gbp } from "@/lib/shop/catalog"
import { trackEvent } from "@/lib/analytics"
export default function ShopProductCard({ product, mode }: { product: ShopProduct; mode: "preview" | "test" | "live" }) {
  const [showArtwork, setShowArtwork] = useState(false)
  const [variant, setVariant] = useState<string>(product.variants[0])
  const [quantity, setQuantity] = useState(1)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [requestId, setRequestId] = useState<string | null>(null)
  async function checkout() {
    if (busy) return
    setBusy(true); setError("")
    const id = requestId || crypto.randomUUID(); setRequestId(id)
    try {
      const res = await fetch("/api/checkout/shop", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId: product.id, variant, quantity, requestId: id }) })
      const data = await res.json()
      if (!res.ok || !data.url) throw new Error(data.error || "Unable to open checkout.")
      trackEvent("shop_checkout_start", { product_id: product.id, quantity })
      window.location.assign(data.url)
    } catch (e) { setError(e instanceof Error ? e.message : "Please try again."); setBusy(false) }
  }
  return <article id={product.id} className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#181818] scroll-mt-24">
    <div className="relative aspect-square bg-[#111820]">
      <Image src={showArtwork ? product.artwork : product.image} alt={showArtwork ? `${product.name} original print artwork` : `${product.name} ${product.kind}`} fill sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw" className="object-contain" />
    </div>
    <div className="flex gap-2 border-b border-zinc-800 p-3" aria-label={`${product.name} image views`}>
      <button type="button" aria-pressed={!showArtwork} onClick={() => setShowArtwork(false)} className={`min-h-10 rounded-md px-4 text-xs font-semibold ${!showArtwork ? "bg-orange-500 text-black" : "text-zinc-300 hover:bg-zinc-800"}`}>On the product</button>
      <button type="button" aria-pressed={showArtwork} onClick={() => setShowArtwork(true)} className={`min-h-10 rounded-md px-4 text-xs font-semibold ${showArtwork ? "bg-orange-500 text-black" : "text-zinc-300 hover:bg-zinc-800"}`}>View artwork</button>
    </div>
    <div className="p-5 sm:p-6">
      <p className="text-xs font-bold uppercase tracking-widest text-orange-400">{product.collection} / {product.kind}</p>
      <div className="mt-3 flex items-start justify-between gap-3"><h2 className="text-2xl font-bold text-white">{product.name}</h2><p className="text-xl font-semibold text-white">{gbp(product.price)}</p></div>
      <p className="mt-3 text-sm leading-6 text-zinc-300">{product.description}</p>
      <details className="mt-3 text-xs leading-5 text-zinc-400"><summary className="cursor-pointer py-2">Product details</summary>{product.details}</details>
      <div className="mt-4 grid grid-cols-[1fr_85px] gap-3">
        <label className="text-xs text-zinc-300" htmlFor={`${product.id}-variant`}>Size / finish<select disabled={busy} id={`${product.id}-variant`} value={variant} onChange={e => { setVariant(e.target.value); setRequestId(null) }} className="mt-2 min-h-11 w-full rounded-md border border-zinc-700 bg-zinc-950 px-2 text-sm">{product.variants.map(v => <option key={v}>{v}</option>)}</select></label>
        <label className="text-xs text-zinc-300" htmlFor={`${product.id}-quantity`}>Quantity<select disabled={busy} id={`${product.id}-quantity`} value={quantity} onChange={e => { setQuantity(Number(e.target.value)); setRequestId(null) }} className="mt-2 min-h-11 w-full rounded-md border border-zinc-700 bg-zinc-950 px-2 text-sm">{Array.from({ length: 10 }, (_,i) => <option key={i} value={i+1}>{i+1}</option>)}</select></label>
      </div>
      <p className="mt-4 text-sm text-zinc-300">{gbp((product.price + SHIPPING_PER_ITEM) * quantity)} total · includes {gbp(SHIPPING_PER_ITEM * quantity)} UK delivery</p>
      <button onClick={checkout} disabled={mode === "preview" || busy} className="mt-4 min-h-12 w-full rounded-md bg-orange-600 px-4 font-bold text-white hover:bg-orange-700 disabled:bg-zinc-800 disabled:text-zinc-400">{busy ? "Opening checkout…" : mode === "preview" ? "Checkout unavailable" : mode === "test" ? "Try test checkout" : "Buy with Stripe"}</button>
      <p className="mt-2 text-xs leading-5 text-zinc-500">{mode === "preview" ? "Stripe is not configured, so checkout cannot start yet." : "One design per checkout. Estimated delivery: 7–12 working days. Items may arrive separately."}</p>
      {error && <p role="alert" className="mt-3 text-sm text-red-300">{error}</p>}
    </div>
  </article>
}
