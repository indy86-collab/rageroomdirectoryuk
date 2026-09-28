"use client"
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react"
import { ShoppingCart } from "lucide-react"
import { type BasketItem, parseBasket, gbp, SHIPPING_PER_ORDER, DELIVERY_MESSAGE } from "@/lib/shop/catalog"
import { trackEvent } from "@/lib/analytics"
const STORAGE_KEY = "rageroom-basket-v1"
const PENDING_KEY = "rageroom-basket-checkout-v1"
const BasketContext = createContext<{ add: (item: BasketItem) => void } | null>(null)
export function useShopBasket() {
  const basket = useContext(BasketContext)
  if (!basket) throw new Error("Missing shop basket")
  return basket
}
export function ClearPaidBasket({ sessionId }: { sessionId: string }) {
  useEffect(() => {
    try {
      // Preserve any basket edits made in another tab after checkout started.
      const pending = JSON.parse(localStorage.getItem(PENDING_KEY) || "null")
      if (pending?.sessionId === sessionId) {
        if (localStorage.getItem(STORAGE_KEY) === pending.snapshot) localStorage.removeItem(STORAGE_KEY)
        localStorage.removeItem(PENDING_KEY)
      }
    } catch { /* Storage may be disabled. */ }
  }, [sessionId])
  return null
}
export default function ShopBasket({ children, mode }: { children: ReactNode; mode: "preview" | "test" | "live" }) {
  const [items, setItems] = useState<BasketItem[]>([])
  const [ready, setReady] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const request = useRef<{ snapshot: string; id: string } | null>(null)
  const inFlight = useRef(false)
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
      if (stored.length) setItems(parseBasket(stored).map(i => ({ productId: i.product.id, variant: i.variant, quantity: i.quantity })))
    } catch { /* Discard obsolete or invalid saved baskets. */ }
    setReady(true)
  }, [])
  useEffect(() => {
    if (ready) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)) } catch { /* In-memory basket still works. */ } }
  }, [items, ready])
  function add(item: BasketItem) {
    if (!ready || busy) throw new Error("Please wait a moment and try again.")
    const next = parseBasket([...items, item]).map(i => ({ productId: i.product.id, variant: i.variant, quantity: i.quantity }))
    setItems(next); setError("")
  }
  const resolved = items.length ? parseBasket(items) : []
  const subtotal = resolved.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  async function checkout() {
    if (!items.length || inFlight.current) return
    inFlight.current = true; setBusy(true); setError("")
    const snapshot = JSON.stringify(items)
    if (request.current?.snapshot !== snapshot) request.current = { snapshot, id: crypto.randomUUID() }
    try {
      const res = await fetch("/api/checkout/shop", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items, requestId: request.current.id }) })
      const data = await res.json()
      if (!res.ok || !data.url) throw new Error(data.error || "Unable to open checkout.")
      try { localStorage.setItem(PENDING_KEY, JSON.stringify({ snapshot, sessionId: data.sessionId })) } catch { /* Optional persistence. */ }
      trackEvent("shop_checkout_start", { quantity: items.reduce((sum, i) => sum + i.quantity, 0) })
      window.location.assign(data.url)
    } catch (e) { setError(e instanceof Error ? e.message : "Please try again."); setBusy(false); inFlight.current = false }
  }
  return <BasketContext.Provider value={{ add }}>
    <div className="mt-4 flex justify-end"><a href="#basket" className="inline-flex min-h-12 items-center gap-2 rounded-md border border-zinc-700 px-4 font-semibold text-white"><ShoppingCart size={20} aria-hidden="true"/>Basket ({items.reduce((sum, i) => sum + i.quantity, 0)})</a></div>
    {children}
    <section id="basket" aria-label="Your basket" className="mt-10 scroll-mt-24 rounded-2xl border border-zinc-800 bg-[#181818] p-5 sm:p-6">
      <h2 tabIndex={-1} className="text-2xl font-bold text-white">Your basket</h2>
      {!items.length ? <p className="mt-4 text-zinc-300">Your basket is empty. Add products from the collection.</p> : <>
        <ul className="divide-y divide-zinc-800">{resolved.map(({ product, variant, quantity }, index) => <li key={`${product.id}-${variant}`} className="flex flex-wrap items-center justify-between gap-4 py-5 text-zinc-300">
          <div className="min-w-0"><h3 className="font-semibold text-white">{product.name} — {product.kind}</h3><p>{variant}</p><p>{gbp(product.price)} each · {gbp(product.price * quantity)}</p></div>
          <div className="flex flex-wrap items-center gap-4"><label className="text-sm">Quantity for {product.name} ({variant})<select aria-label={`Quantity for ${product.name} (${variant})`} disabled={busy} value={quantity} onChange={e => { setItems(items.map((item, n) => n === index ? { ...item, quantity: Number(e.target.value) } : item)); setError("") }} className="ml-2 min-h-11 rounded-md border border-zinc-700 bg-zinc-950 px-3">{Array.from({ length: 10 }, (_, i) => <option key={i} value={i+1}>{i+1}</option>)}</select></label><button disabled={busy} onClick={() => { setItems(items.filter((_, n) => n !== index)); setError("") }} aria-label={`Remove ${product.name} (${variant})`} className="min-h-11 text-orange-400 underline">Remove</button></div>
        </li>)}</ul>
        <dl className="ml-auto max-w-sm space-y-3 border-t border-zinc-700 pt-5 text-white"><div className="flex justify-between"><dt>Subtotal</dt><dd>{gbp(subtotal)}</dd></div><div className="flex justify-between"><dt>Delivery</dt><dd>{gbp(SHIPPING_PER_ORDER)}</dd></div><div className="flex justify-between font-bold"><dt>Total</dt><dd>{gbp(subtotal + SHIPPING_PER_ORDER)}</dd></div></dl>
      </>}
      <p className="mt-4 text-sm leading-6 text-zinc-400">{DELIVERY_MESSAGE}</p>
      <div className="mt-5 flex flex-wrap items-center gap-5"><button onClick={checkout} disabled={!ready || !items.length || busy || mode === "preview"} className="min-h-12 rounded-md bg-orange-600 px-5 font-bold text-white hover:bg-orange-700 disabled:bg-zinc-800 disabled:text-zinc-400">{busy ? "Opening checkout…" : mode === "preview" ? "Checkout unavailable" : mode === "test" ? "Checkout with Stripe (test)" : "Checkout with Stripe"}</button><a href="#collection" className="min-h-11 content-center text-orange-400 underline">Continue shopping</a></div>
      {error && <p role="alert" className="mt-3 text-red-300">{error}</p>}
    </section>
  </BasketContext.Provider>
}
