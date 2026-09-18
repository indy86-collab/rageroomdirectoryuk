import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { shopProducts } from "@/lib/shop/catalog"

export default function ShopHomeAnnouncement() {
  return (
    <section
      aria-labelledby="smash-collection-heading"
      className="site-container scroll-mt-24 py-12 sm:py-16"
    >
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#171717]">
        <div className="grid items-center gap-6 p-6 sm:p-8 md:grid-cols-[1.15fr_0.85fr] sm:gap-8">
          <div>
            <p className="eyebrow mb-2">New merch</p>
            <h2 id="smash-collection-heading" className="section-title">
              The smash collection
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-300 sm:text-base">
              Five original rage-room designs for crews, team days and the coffee
              afterwards. UK delivery, paid securely with Stripe.
            </p>
            <Link
              href="/shop"
              className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-rage-300"
            >
              Shop the collection
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ul className="grid grid-cols-5 gap-2">
            {shopProducts.map((product) => (
              <li key={product.id}>
                <Link
                  href={`/shop#${product.id}`}
                  className="block overflow-hidden rounded-lg bg-[#111820]"
                >
                  <Image
                    src={product.image}
                    alt={`${product.name} ${product.kind}`}
                    width={240}
                    height={240}
                    className="aspect-square object-contain"
                    sizes="(max-width: 1023px) 18vw, 96px"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
