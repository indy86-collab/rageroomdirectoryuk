import { Metadata } from "next"
import Link from "next/link"
import Breadcrumbs from "@/components/Breadcrumbs"
import GuideMeta from "@/components/GuideMeta"
import AdsenseInContent from "@/components/ads/AdsenseInContent"
import FAQ from "@/components/FAQ"
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildOgImageUrl,
} from "@/lib/seo-schema"

const PATH = "/guides/rage-room-gift-vouchers-uk"

const OG_IMAGE = buildOgImageUrl({
  title: "Rage Room Gift Vouchers UK",
  subtitle: "How to buy · What to check · Best venues 2026",
  badge: "Gift Guide",
})

export const metadata: Metadata = {
  title: "Rage Room Gift Vouchers UK | How to Buy & What to Check (2026)",
  description:
    "Everything you need to know about buying a rage room gift voucher in the UK — prices, expiry, what's included, which venues offer them, and how to avoid common pitfalls.",
  alternates: { canonical: PATH },
  openGraph: {
    title: "Rage Room Gift Vouchers UK | Buying Guide 2026",
    description:
      "Buy a UK rage room gift voucher with confidence — prices, expiry policies, what's included, and the best venues to buy from.",
    type: "article",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Rage room gift vouchers UK guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rage Room Gift Vouchers UK",
    description: "How to buy a rage room gift voucher in the UK — prices, expiry and best venues.",
    images: [OG_IMAGE],
  },
}

export const revalidate = 86400

const VOUCHER_TYPES: { name: string; price: string; best: string; notes: string }[] = [
  {
    name: "Solo session voucher",
    price: "£25–£45",
    best: "Birthdays, Secret Santa, solo treat",
    notes: "Covers a single person's 15–30 minute session. Most flexible for recipients to redeem at their own pace.",
  },
  {
    name: "Couples voucher",
    price: "£55–£95",
    best: "Anniversary, Valentine's, date-night gift",
    notes: "Private joint session for two. Some venues offer couples-specific packages with extra breakables.",
  },
  {
    name: "Group session voucher",
    price: "£120–£250+",
    best: "Birthday group gift, leaving do, stag/hen deposit",
    notes: "Covers 4–8 people. Check whether the venue holds the slot at booking or on redemption.",
  },
  {
    name: "Open-value e-voucher",
    price: "Any amount",
    best: "When you don't know the recipient's group size",
    notes: "Credit applied against any booking. Maximum flexibility — the recipient chooses session type and size.",
  },
]

const FAQS = [
  {
    question: "Can you buy a rage room gift voucher online in the UK?",
    answer:
      "Yes — most UK rage rooms sell e-vouchers directly through their website. You receive a PDF or digital code by email, which the recipient books and redeems online. Physical vouchers are available at some venues but are increasingly rare.",
  },
  {
    question: "How long do UK rage room gift vouchers last?",
    answer:
      "Expiry varies by venue. Most UK venues issue vouchers valid for 6–12 months from purchase. Premium venues sometimes offer 12–18 months. Always check the expiry before buying — and tell the recipient to book well before the expiry date, not on it.",
  },
  {
    question: "Are rage room vouchers refundable?",
    answer:
      "Vouchers are typically non-refundable once issued, though some venues allow exchange for a different session type or date. Under UK consumer law, digital content vouchers may have specific cancellation rights if not yet used — check the venue's T&Cs and, if in doubt, book directly through a venue with clear refund policies.",
  },
  {
    question: "How much should I spend on a rage room gift voucher?",
    answer:
      "For a solo voucher, £30–£45 is typical and covers a standard session. For a couples gift, budget £60–£90. For a group birthday gift, £150–£250 buys a solid group session for 4–6 people in most UK cities (add 15–20% for London venues).",
  },
  {
    question: "Can the recipient choose their own venue with a gift voucher?",
    answer:
      "Vouchers are generally venue-specific — they can only be redeemed at the issuing venue. There is currently no universal UK rage room gift card that works across multiple operators. If flexibility matters, buy from a venue with multiple locations, or give an open-value voucher from a large multi-site operator.",
  },
  {
    question: "What age do you need to be to use a rage room gift voucher?",
    answer:
      "Most UK venues require participants to be 18+. If buying for a 14–17 year old, confirm the venue runs youth sessions before purchasing — not all do. Vouchers are generally non-refundable if the recipient doesn't meet the age requirement.",
  },
  {
    question: "What is typically included in a rage room session voucher?",
    answer:
      "A standard voucher covers PPE (coveralls, helmet, gloves, boots), a safety briefing, and a set quantity of breakable items for the stated session length. Extra breakables, professional photography, custom music and themed rooms are usually add-ons at extra cost.",
  },
  {
    question: "Can I buy a rage room voucher as a last-minute gift?",
    answer:
      "Yes — e-vouchers from most UK venues are delivered instantly by email and make great last-minute gifts for birthdays, Christmas and Valentine's Day. If the venue's website isn't clear on instant delivery, call ahead to confirm.",
  },
]

export default function RageRoomGiftVouchersUKPage() {
  const articleSchema = buildArticleSchema({
    url: PATH,
    headline: "Rage Room Gift Vouchers UK: How to Buy, Prices & What to Check",
    description:
      "Complete UK guide to buying a rage room gift voucher — types, prices, expiry policies and what to look for in a good voucher.",
    datePublished: "2026-05-01",
    keywords: [
      "rage room gift voucher UK",
      "smash room gift voucher",
      "rage room gift ideas UK",
      "rage room experience gift",
      "buy rage room voucher",
    ],
  })

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Guides", url: "/guides" },
    { name: "Rage Room Gift Vouchers UK", url: PATH },
  ])

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `https://rageroomdirectory.co.uk${PATH}#faq`,
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  }

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />

        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Guides", href: "/guides" },
            { label: "Rage Room Gift Vouchers UK" },
          ]}
        />

        <article>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
            Rage Room Gift Vouchers UK: The Complete Buying Guide
          </h1>

          <GuideMeta
            updated="May 2026"
            readingTimeMinutes={7}
            keyTakeaways={[
              "Most UK venues sell e-vouchers instantly by email — ideal for last-minute gifts.",
              "Standard solo vouchers cost £25–£45; couples vouchers £55–£95; group vouchers £120–£250+.",
              "Expiry is typically 6–12 months — tell the recipient to book early, not near the expiry date.",
              "Vouchers are venue-specific: there is no universal UK rage room gift card.",
              "Always confirm the recipient meets the age requirement (usually 18+) before purchasing.",
            ]}
          />

          <p className="text-base sm:text-lg text-zinc-300 mb-4 leading-relaxed">
            A rage room gift voucher is one of the most genuinely original experience gifts you can buy in the UK right now. It works for birthdays, Valentine&apos;s, Christmas, leaving presents, and &ldquo;just because&rdquo; occasions — and it&apos;s far more memorable than anything you&apos;d find in a gift shop.
          </p>
          <p className="text-base sm:text-lg text-zinc-300 mb-8 leading-relaxed">
            This guide covers everything you need to know before you buy: the different voucher types, typical prices, expiry policies, what&apos;s included, and what to watch out for.
          </p>

          <AdsenseInContent />

          <section aria-labelledby="types-heading" className="mb-10">
            <h2 id="types-heading" className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Types of rage room gift voucher
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {VOUCHER_TYPES.map((v) => (
                <div
                  key={v.name}
                  className="bg-[#181818] border border-zinc-800 rounded-lg p-5"
                >
                  <h3 className="text-lg font-bold text-white mb-1">{v.name}</h3>
                  <p className="text-orange-500 font-semibold text-sm mb-2">{v.price}</p>
                  <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1">Best for</p>
                  <p className="text-zinc-300 text-sm mb-3">{v.best}</p>
                  <p className="text-zinc-400 text-sm leading-relaxed">{v.notes}</p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="what-to-check-heading" className="mb-10">
            <h2 id="what-to-check-heading" className="text-2xl sm:text-3xl font-bold text-white mb-4">
              What to check before you buy
            </h2>
            <div className="space-y-5">
              {[
                {
                  title: "1. Expiry date",
                  text: "Most vouchers are valid for 6–12 months. A voucher that expires in 6 months bought in November may run out before the recipient can use it in spring. Look for at least 12-month validity if you&apos;re buying a Christmas or birthday gift.",
                },
                {
                  title: "2. What&apos;s included",
                  text: "Does the voucher cover PPE, safety briefing and a set number of breakables? Or is it just a session discount? Read the fine print — at some venues, breakables are charged separately on top of the session fee.",
                },
                {
                  title: "3. Age and health restrictions",
                  text: "Standard UK venues are 18+. Some run youth sessions for 14–17 year olds with extra supervision and parental consent requirements. If you&apos;re buying for someone younger, confirm the venue can accommodate them before buying.",
                },
                {
                  title: "4. Booking flexibility",
                  text: "Can the recipient book any available slot, or are they restricted to off-peak times? Premium vouchers typically allow full-week availability; budget vouchers may exclude Saturdays or peak times.",
                },
                {
                  title: "5. Venue location",
                  text: "Vouchers are venue-specific. Make sure the venue is within reasonable travelling distance for the recipient — a voucher for a London venue isn&apos;t much use to someone based in Leeds.",
                },
                {
                  title: "6. Cancellation and rescheduling policy",
                  text: "Life happens. Check whether the recipient can reschedule their booking without losing the voucher value, and how much notice is required. Most venues require 48–72 hours notice to reschdeule.",
                },
              ].map((item) => (
                <div key={item.title} className="border-l-2 border-orange-500 pl-4">
                  <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                  <p className="text-zinc-300 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: item.text }}
                  />
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="occasions-heading" className="mb-10">
            <h2 id="occasions-heading" className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Best occasions for a rage room voucher
            </h2>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Rage room vouchers work best as a gift when the recipient is likely to actually use them. Here are the occasions where they land best:
            </p>
            <ul className="space-y-2 text-zinc-300 list-disc list-inside ml-2">
              <li><strong className="text-white">Milestone birthdays (30th, 40th, 50th)</strong> — a physical, memorable experience gift beats another bottle of wine.</li>
              <li><strong className="text-white">Leaving dos and end-of-contract gifts</strong> — especially popular for work colleagues who want to mark the end of a stressful chapter.</li>
              <li><strong className="text-white">Valentine&apos;s Day couples gift</strong> — unconventional date-night vouchers for couples who&apos;d rather smash things than eat overpriced prix fixe menus.</li>
              <li><strong className="text-white">Christmas and Secret Santa</strong> — £30–£40 is right in the Secret Santa budget for a solo voucher.</li>
              <li><strong className="text-white">Exam results / end-of-academic-year</strong> — a popular teen and student gift (check age restrictions apply).</li>
              <li><strong className="text-white">Stress relief &ldquo;thinking of you&rdquo; gift</strong> — genuinely useful for someone going through a difficult period who needs a physical outlet.</li>
            </ul>
          </section>

          <section aria-labelledby="find-voucher-heading" className="mb-10">
            <h2 id="find-voucher-heading" className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Where to buy a rage room voucher
            </h2>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Buy directly from the venue rather than through a third-party experience gift platform. Direct purchase typically means:
            </p>
            <ul className="space-y-1 text-zinc-300 list-disc list-inside ml-2 mb-4">
              <li>Better price (no middleman markup)</li>
              <li>More flexible redemption terms</li>
              <li>Easier customer service if issues arise</li>
              <li>More accurate information about what&apos;s included</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed">
              Use our directory to find a venue near the recipient, then check their website for a &ldquo;gift vouchers&rdquo; or &ldquo;buy a gift&rdquo; link.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {["london", "manchester", "birmingham", "leeds", "liverpool"].map((city) => (
                <Link
                  key={city}
                  href={`/city/${city}`}
                  className="text-sm text-orange-500 hover:text-orange-400 underline capitalize"
                >
                  Rage rooms in {city.charAt(0).toUpperCase() + city.slice(1)}
                </Link>
              ))}
              <Link href="/listings" className="text-sm text-orange-500 hover:text-orange-400 underline">
                All UK rage rooms
              </Link>
            </div>
          </section>

          <section aria-labelledby="related-voucher-heading" className="mb-10">
            <h2 id="related-voucher-heading" className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Related guides
            </h2>
            <ul className="space-y-2 text-zinc-300">
              <li>
                <Link href="/guides/rage-rooms-for-birthdays-uk" className="text-orange-500 hover:text-orange-400 underline">
                  Rage rooms for birthday parties UK
                </Link>
              </li>
              <li>
                <Link href="/guides/best-rage-rooms-for-couples" className="text-orange-500 hover:text-orange-400 underline">
                  Best rage rooms for couples
                </Link>
              </li>
              <li>
                <Link href="/guides/rage-rooms-for-hen-parties-uk" className="text-orange-500 hover:text-orange-400 underline">
                  Rage rooms for hen parties
                </Link>
              </li>
              <li>
                <Link href="/guides/how-much-do-rage-rooms-cost-uk" className="text-orange-500 hover:text-orange-400 underline">
                  How much do rage rooms cost in the UK?
                </Link>
              </li>
              <li>
                <Link href="/guides/are-rage-rooms-safe-uk" className="text-orange-500 hover:text-orange-400 underline">
                  Are rage rooms safe?
                </Link>
              </li>
            </ul>
          </section>

          <FAQ items={FAQS.map((f) => ({ question: f.question, answer: f.answer }))} title="Gift voucher FAQs" />

          <div className="mt-10 text-center">
            <Link
              href="/listings"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-md transition-colors"
            >
              Find a Venue to Buy From
            </Link>
          </div>
        </article>
      </div>
    </div>
  )
}
