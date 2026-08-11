import type { Metadata } from "next"
import { Check, ClipboardList, Sparkles } from "lucide-react"
import DigitalEditorialByline from "@/components/DigitalEditorialByline"
import DigitalPriceDisplay from "@/components/DigitalPriceDisplay"
import DigitalProductCover from "@/components/DigitalProductCover"
import FAQ from "@/components/FAQ"
import FirstTimerChecklistPreview from "@/components/FirstTimerChecklistPreview"
import FirstVisitChecklistCTA from "@/components/FirstVisitChecklistCTA"
import LeadMagnetForm from "@/components/LeadMagnetForm"
import ProductViewTracker from "@/components/ProductViewTracker"
import TrackedProductLink from "@/components/TrackedProductLink"
import {
  getDigitalProduct,
  getDigitalProductAnalytics,
} from "@/lib/digital-products"
import { FIRST_TIMER_CHECKLIST_TAGLINE } from "@/lib/first-timer-checklist"
import { buildDigitalProductSchema } from "@/lib/seo-schema"

const product = getDigitalProduct("rage-room-first-visit-prep")!
const analyticsProduct = getDigitalProductAnalytics(product)
const partyProduct = getDigitalProduct("rage-room-party-planner")!
const partyAnalyticsProduct = getDigitalProductAnalytics(partyProduct)
const giftProduct = getDigitalProduct("rage-room-gift-voucher-template-pack")!
const giftAnalyticsProduct = getDigitalProductAnalytics(giftProduct)

export const metadata: Metadata = {
  title: "FREE Rage Room First-Timer Checklist | What to Wear & Bring",
  description:
    "Free rage room first-timer checklist. Know what to wear, what to bring, what to check with the venue and what to expect before your first smash session. Free download — no account required.",
  alternates: {
    canonical: "/digital-downloads/rage-room-first-visit-prep-pack",
  },
}

const previewHighlights = [
  {
    title: "Before you book",
    items: ["Age limits", "Session length", "What’s included", "Cancellation policy"],
  },
  {
    title: "What to wear & bring",
    items: ["Closed-toe shoes", "Comfortable clothes", "PPE expectations", "ID if needed"],
  },
  {
    title: "On the day",
    items: ["Arrival timing", "Typical journey", "Venue questions", "Phone-ready checks"],
  },
]

const audiences = [
  "First-time visitors",
  "Nervous bookers",
  "Couples trying it once",
  "Parents checking rules for teens",
  "Anyone unsure what to wear",
  "Friends joining a group night",
]

const faqs = [
  {
    question: "Is this really free?",
    answer:
      "Yes. Enter your email and you get the checklist immediately. No payment, no account, no Stripe checkout.",
  },
  {
    question: "Does this include a rage room booking?",
    answer:
      "No. This is a preparation checklist. You still book directly with your chosen venue.",
  },
  {
    question: "Will you email me marketing?",
    answer:
      "Only if you opt in on the form. Requesting the checklist alone sends the download email — it is not treated as consent for unrelated marketing.",
  },
  {
    question: "Is it UK-specific?",
    answer:
      "Yes. It uses UK-focused planning language and typical UK venue processes. Always confirm details with your venue — rules differ.",
  },
  {
    question: "Is this medical or safety advice?",
    answer:
      "No. It is a planning aid only. Always follow the venue’s rules, waiver requirements and staff instructions.",
  },
  {
    question: "How is this different from the Party Planner Pack?",
    answer:
      "This free checklist is for first-timers getting ready for a session. The Party Planner Pack is a paid kit for organising a full group event with budgets, RSVPs and invites.",
  },
]

type PageProps = {
  searchParams?: { source?: string }
}

export default function RageRoomFirstVisitPrepPackPage({ searchParams }: PageProps) {
  const source =
    typeof searchParams?.source === "string" && searchParams.source.trim()
      ? searchParams.source.trim().slice(0, 80)
      : "first-visit-product"

  const productSchema = buildDigitalProductSchema({
    name: product.name,
    description: product.description,
    url: `/digital-downloads/${product.slug}`,
    price: 0,
    currency: product.currency,
    image: product.marketingImage,
    sku: product.analyticsItemId,
  })

  return (
    <div className="bg-dark-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <ProductViewTracker product={analyticsProduct} />
      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-rage-500">
              Free digital tool
            </p>
            <h1 className="mt-4 text-4xl font-black uppercase tracking-wide text-white sm:text-5xl lg:text-6xl">
              FREE Rage Room First-Timer Checklist
            </h1>
            <DigitalEditorialByline className="mt-3" />
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-300">
              {FIRST_TIMER_CHECKLIST_TAGLINE}
            </p>
            <p className="mt-3 max-w-2xl text-sm text-zinc-400">
              Know what to wear, what to bring, what to check with the venue and what to
              expect before you arrive. Free. Takes 2 minutes to read.
            </p>
            <div className="mt-6">
              <DigitalPriceDisplay product={product} />
            </div>
          </div>
          {product.marketingImage && (
            <DigitalProductCover
              src={product.marketingImage}
              alt={`${product.name} cover`}
              priority
            />
          )}
        </div>
      </section>

      <section
        id="get-checklist"
        className="scroll-mt-24 px-4 pb-6 sm:px-6"
      >
        <div className="mx-auto max-w-3xl rounded-lg border border-rage-500/35 bg-[#181818] p-5 sm:p-7">
          <div className="mb-5 flex items-start gap-3">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-md border border-rage-500/40 bg-rage-500/15">
              <ClipboardList className="h-5 w-5 text-rage-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white sm:text-2xl">
                Get the Free Checklist
              </h2>
              <p className="mt-1 text-sm text-zinc-400">
                Enter your email for instant access. No account required.
              </p>
            </div>
          </div>
          <LeadMagnetForm source={source} idPrefix="first-visit-product" />
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-6xl">
          <h2 className="section-title mb-2">What’s inside</h2>
          <p className="mb-6 max-w-2xl text-sm text-zinc-400">
            A practical checklist you can keep open on your phone before you visit.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {previewHighlights.map((group) => (
              <div key={group.title} className="card-base p-5">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md border border-rage-500/40 bg-rage-500/15">
                  <ClipboardList className="h-5 w-5 text-rage-500" />
                </div>
                <h3 className="text-lg font-bold text-white">{group.title}</h3>
                <ul className="mt-4 space-y-2">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-zinc-300">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-rage-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-textured px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-3xl">
          <h2 className="section-title mb-4">Checklist preview</h2>
          <FirstTimerChecklistPreview variant="preview" />
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-6xl">
          <h2 className="section-title mb-6">Who it helps</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {audiences.map((audience) => (
              <div
                key={audience}
                className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-[#181818] p-4"
              >
                <Sparkles className="h-4 w-4 flex-shrink-0 text-rage-500" />
                <span className="text-sm font-semibold text-zinc-200">{audience}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-textured px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-4xl">
          <FAQ items={faqs} title="First-Timer Checklist FAQs" />
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-4xl space-y-4">
          <div className="rounded-lg border border-zinc-800 bg-[#181818] p-6">
            <h2 className="text-xl font-bold text-white">Organising a group night?</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-300">
              Use the Rage Room Party Planner Pack for budgets, RSVPs, invites and the full
              night-out plan.
            </p>
            <TrackedProductLink
              href="/digital-downloads/rage-room-party-planner-pack"
              product={partyAnalyticsProduct}
              listName="Digital Product Cross-Sell"
              className="mt-4 inline-flex min-h-[44px] items-center text-sm font-semibold text-rage-500 hover:text-rage-400"
            >
              View party planner pack — {partyProduct.priceLabel}
            </TrackedProductLink>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-[#181818] p-6">
            <h2 className="text-xl font-bold text-white">Giving it as a gift?</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-300">
              Pair prep with DIY printable gift voucher templates (not a venue booking).
            </p>
            <TrackedProductLink
              href="/digital-downloads/rage-room-gift-voucher-template-pack"
              product={giftAnalyticsProduct}
              listName="Digital Product Cross-Sell"
              className="mt-4 inline-flex min-h-[44px] items-center text-sm font-semibold text-rage-500 hover:text-rage-400"
            >
              View voucher templates — {giftProduct.priceLabel}
            </TrackedProductLink>
          </div>
        </div>
      </section>

      <section className="px-4 pb-14 sm:px-6 sm:pb-16">
        <div className="mx-auto max-w-4xl">
          <FirstVisitChecklistCTA source="first-visit-footer" />
        </div>
      </section>
    </div>
  )
}
