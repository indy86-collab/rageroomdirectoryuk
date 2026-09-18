import Link from "next/link"
import type { Metadata } from "next"
import ShopProductCard from "@/components/shop/ShopProductCard"
import { shopProducts } from "@/lib/shop/catalog"
import { shopSeller } from "@/lib/shop/seller"
import Breadcrumbs from "@/components/Breadcrumbs"
import { shopCheckoutMode } from "@/lib/shop/checkout"
export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Gifts & Merch | RageRoom Directory", description: "Rage-room merchandise for smash crews, team outings and post-session coffee. Explore the RageRoom Directory merchandise collection.", alternates: { canonical: "/shop" } }
export default function ShopPage({ searchParams }: { searchParams: { cancelled?: string } }) {
 const mode = shopCheckoutMode()
 const seller = shopSeller()
 return <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
  <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }]} />
  <div className="mt-8 max-w-3xl"><p className="text-xs font-bold uppercase tracking-[0.25em] text-orange-400">RageRoom Directory / The smash collection</p>
    <h1 className="mt-4 text-5xl font-black leading-[1.05] tracking-tight text-white sm:text-7xl">Wear it. Smash it.<br/><span className="text-orange-500">Remember it.</span></h1>
    <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-300">The kit for people who would rather smash a plate than make small talk. Original rage-room designs for your crew, your team day and the coffee afterwards.</p>
    <a href="#collection" className="mt-6 inline-flex min-h-12 items-center rounded-md bg-orange-600 px-5 font-semibold text-white">Explore the collection ↓</a>
    <Link href="/listings" className="ml-4 inline-flex min-h-12 items-center text-sm font-semibold text-zinc-300 underline">Find your next rage room →</Link>
  </div>
  <div role="status" className="my-8 rounded-lg border border-zinc-700 bg-zinc-900 p-4 text-sm leading-6 text-zinc-300">{mode === "preview" ? "Checkout is paused because Stripe is not configured." : mode === "test" ? "Test shop — use Stripe test payment details only. No physical orders will be fulfilled." : "Made to order · UK delivery · Secure Stripe checkout. Delivery is estimated at 7–12 working days; items may arrive separately."}</div>
  {searchParams.cancelled && <p className="mb-6 text-orange-300">Checkout cancelled. You can change your selection and try again.</p>}
  <section id="collection" aria-label="Merchandise collection" className="grid scroll-mt-24 gap-6 md:grid-cols-2 lg:grid-cols-3">{shopProducts.map(product => <ShopProductCard key={product.id} product={product} mode={mode}/>)}</section>
  <section className="mt-12 grid gap-6 border-t border-zinc-800 pt-8 sm:grid-cols-3">
    <div><h2 className="font-bold text-white">For the whole smash crew</h2><p className="mt-3 text-sm leading-6 text-zinc-400">Mark a birthday, stag or hen outing, or a team day with a design made for rage-room fans. These are everyday gifts, not protective equipment. Follow your venue’s clothing and safety rules.</p></div>
    <div><h2 className="font-bold text-white">Delivery, clearly priced</h2><p className="mt-3 text-sm leading-6 text-zinc-400">£4.99 per item for UK delivery. Your full total is shown before payment. Orders may ship in separate parcels.</p></div>
    <div><h2 className="font-bold text-white">A real person to help</h2><p className="mt-3 text-sm leading-6 text-zinc-400">Questions about an order? Email <a className="underline" href="mailto:ukrageroom@gmail.com">ukrageroom@gmail.com</a>.</p><Link className="mt-2 inline-block text-sm text-orange-400 underline" href="/shop/delivery-returns">Delivery & returns</Link></div>
  </section>
  {mode !== "preview" && <p className="mt-8 text-xs text-zinc-400">Sold by {seller.name}. <Link className="underline" href="/shop/delivery-returns">Seller details, delivery & returns</Link> · <Link className="underline" href="/privacy">Privacy policy</Link></p>}
 </div>
}
