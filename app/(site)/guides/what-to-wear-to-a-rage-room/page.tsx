import { Metadata } from "next"
import Link from "next/link"
import Breadcrumbs from "@/components/Breadcrumbs"
import GuideMeta from "@/components/GuideMeta"
import DigitalDownloadCTA from "@/components/DigitalDownloadCTA"
import FAQ from "@/components/FAQ"
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildHowToSchema,
  buildOgImageUrl,
} from "@/lib/seo-schema"

const PATH = "/guides/what-to-wear-to-a-rage-room"

const OG_IMAGE = buildOgImageUrl({
  title: "What to Wear to a Rage Room",
  subtitle: "UK dress code guide · What to bring & avoid",
  badge: "First-Time",
})

export const metadata: Metadata = {
  title: "What to Wear to a Rage Room UK | Dress Code & What to Bring (2026)",
  description:
    "Wondering what to wear to a rage room? Full UK guide: what clothing works best under PPE, what footwear to wear, what not to bring, and how to prepare for your session.",
  alternates: { canonical: PATH },
  openGraph: {
    title: "What to Wear to a Rage Room UK | Dress Code Guide",
    description:
      "Full UK rage room dress code guide — best clothing, footwear, what to avoid wearing, and how to prepare for your first session.",
    type: "article",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "What to wear to a rage room UK guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "What to Wear to a Rage Room UK",
    description: "Dress code, best clothing, footwear and what to avoid — UK rage room guide.",
    images: [OG_IMAGE],
  },
}

export const revalidate = 86400

const FAQS = [
  {
    question: "What should I wear to a rage room?",
    answer:
      "Wear comfortable, non-precious clothing you don't mind getting dusty, sweaty or potentially marked. Jeans or joggers and a fitted long-sleeved top are ideal. The venue will provide full-body PPE coveralls that go over your clothes, so nothing underneath will be visible — but dress for the physical exertion, not for appearance.",
  },
  {
    question: "Do I need to bring my own safety equipment?",
    answer:
      "No — reputable UK rage rooms provide all mandatory PPE: full-body coveralls, a full-face visor helmet, heavy-duty gloves and boots. You don't need to bring any of your own safety equipment. Just bring suitable footwear (closed-toe shoes or boots) in case the venue's boot range doesn't include your size.",
  },
  {
    question: "What shoes should I wear to a rage room?",
    answer:
      "Wear closed-toe shoes with a solid, sturdy sole — ideally something you've worn before and are comfortable in. Trainers, work boots or robust walking shoes all work well. Open-toed shoes, sandals, flip-flops, very high heels and delicate shoes are not suitable. Some venues provide steel-toed boots, but supplies of specific sizes can be limited.",
  },
  {
    question: "Can I wear jewellery to a rage room?",
    answer:
      "Remove all jewellery before your session — rings, bracelets, necklaces, earrings and piercings that can catch. The venue will ask you to do this before you put on PPE. Caught jewellery under a glove or helmet strap is the most common source of minor scrapes at rage rooms. Leave jewellery at home or in your bag during the session.",
  },
  {
    question: "Can I wear my own clothes or will they get ruined?",
    answer:
      "Your clothes go under coveralls, so they are protected from glass and debris. However, you will sweat — a 30-minute smash session is genuinely physical. Bring a spare top or travel to the venue in clothes you're comfortable wearing sweaty, or bring a change for afterwards.",
  },
  {
    question: "Can I wear contact lenses to a rage room?",
    answer:
      "Yes — you wear a full-face visor helmet which protects your eyes from all debris. Contact lenses are fine. If you wear glasses, these will go under your visor; discuss with the venue if you have very large frames, as most visors accommodate standard glasses without issue.",
  },
  {
    question: "What should I not wear to a rage room?",
    answer:
      "Avoid: open-toed shoes or sandals; loose jewellery or watches; very loose-fitting clothing with dangly ties or cords that could catch; anything you'd be upset about getting sweaty or dusty; formal or smart clothing. Heels are usually banned for safety reasons.",
  },
  {
    question: "Can I wear makeup to a rage room?",
    answer:
      "Yes, but your face will be enclosed in a helmet for the full session and you'll get hot and sweaty. Most people find that minimal or no makeup is more comfortable. The visor and helmet can smudge heavy eye makeup. Bring a face wipe if this matters to you.",
  },
]

export default function WhatToWearToARageRoomPage() {
  const articleSchema = buildArticleSchema({
    url: PATH,
    headline: "What to Wear to a Rage Room: UK Dress Code & Preparation Guide",
    description:
      "Complete guide to rage room dress code in the UK — what to wear, what footwear to bring, what to leave at home, and how to prepare for your session.",
    datePublished: "2026-05-01",
    keywords: [
      "what to wear to a rage room",
      "rage room dress code",
      "rage room outfit",
      "rage room clothing",
      "what to bring to a rage room",
      "rage room shoes",
    ],
  })

  const howToSchema = buildHowToSchema({
    name: "How to dress for a rage room session",
    description:
      "Step-by-step guide to preparing your clothing and footwear for a UK rage room visit.",
    url: PATH,
    totalTime: "PT10M",
    steps: [
      {
        name: "Choose comfortable base clothing",
        text: "Put on comfortable jeans, joggers or fitted trousers, and a long-sleeved fitted top. Avoid loose dangling items. You'll wear coveralls over these, but dress for physical exertion.",
      },
      {
        name: "Wear closed-toe sturdy shoes",
        text: "Put on trainers, boots or solid walking shoes. Closed toe and solid sole are mandatory. Bring your own if the venue's boot range is limited in your size.",
      },
      {
        name: "Remove all jewellery",
        text: "Take off rings, bracelets, necklaces, earrings and any other jewellery before arriving, or remove it at the venue. Store it safely in your bag.",
      },
      {
        name: "Tie back long hair",
        text: "Tie hair back securely into a low ponytail or bun before your helmet fitting. Very high buns can make the helmet uncomfortable; low is better.",
      },
      {
        name: "Put on your PPE at the venue",
        text: "Staff will fit you with coveralls over your clothes, then your full-face visor helmet, heavy-duty gloves and boots. All PPE is provided and mandatory.",
      },
      {
        name: "Pack a spare top (optional)",
        text: "If you want to feel fresh after your session, bring a spare top or change of clothes in your bag. A 30-minute smash session involves real physical exertion.",
      },
    ],
  })

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Guides", url: "/guides" },
    { name: "What to Wear to a Rage Room", url: PATH },
  ])

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `https://www.rageroomdirectory.co.uk${PATH}#faq`,
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
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
            { label: "What to Wear to a Rage Room" },
          ]}
        />

        <article>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
            What to Wear to a Rage Room: UK Dress Code Guide
          </h1>

          <GuideMeta
            updated="May 2026"
            readingTimeMinutes={6}
            keyTakeaways={[
              "Wear comfortable, non-precious clothes you don't mind getting sweaty — coveralls go over everything.",
              "Closed-toe sturdy shoes are mandatory. Open-toed shoes and heels are never allowed.",
              "Remove all jewellery before your session — rings, bracelets, earrings, watches.",
              "All PPE is provided: coveralls, full-face visor helmet, gloves and boots.",
              "Tie long hair back low — high buns make helmet fitting uncomfortable.",
            ]}
          />

          <p className="text-base sm:text-lg text-zinc-300 mb-4 leading-relaxed">
            The short answer: wear comfortable clothes, bring closed-toe shoes, remove your jewellery, and don&apos;t overthink it. The venue provides everything else. But there are a few things worth knowing before you arrive — especially if it&apos;s your first visit.
          </p>
          <p className="text-base sm:text-lg text-zinc-300 mb-8 leading-relaxed">
            This guide covers exactly what to wear, what to avoid, how to prepare for the PPE fitting, and a few tips that make the experience more comfortable.
          </p>


          <section aria-labelledby="what-wear-heading" className="mb-10">
            <h2 id="what-wear-heading" className="text-2xl sm:text-3xl font-bold text-white mb-4">
              What to wear (under your PPE)
            </h2>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Everything you wear goes under the venue&apos;s PPE coveralls, so appearance is irrelevant. The only things that matter are comfort, practicality and safety.
            </p>

            <div className="grid gap-4 sm:grid-cols-2 mb-6">
              {[
                {
                  category: "Top",
                  recommendation: "Fitted long-sleeved top or a t-shirt",
                  notes: "Long sleeves offer extra warmth and coverage under the coverall. Avoid anything with very long, dangling cords, ties or large decorative elements that could catch.",
                },
                {
                  category: "Bottom",
                  recommendation: "Jeans, joggers, or fitted trousers",
                  notes: "Jeans are the most popular choice — they're durable and comfortable. Avoid very flared bottoms or anything with exposed drawstrings.",
                },
                {
                  category: "Shoes",
                  recommendation: "Trainers, boots or sturdy walking shoes",
                  notes: "Closed toe and solid sole are non-negotiable. Bring shoes you've worn before — blisters mid-session are unpleasant.",
                },
                {
                  category: "Socks",
                  recommendation: "Thick socks",
                  notes: "If the venue provides boots, thick socks make them more comfortable and more hygienic. Thin trainer socks in a venue boot are not pleasant.",
                },
              ].map((item) => (
                <div key={item.category} className="bg-[#181818] border border-zinc-800 rounded-lg p-4">
                  <p className="text-xs uppercase tracking-widest text-orange-500 mb-1">{item.category}</p>
                  <p className="text-white font-semibold mb-2">{item.recommendation}</p>
                  <p className="text-zinc-400 text-sm leading-relaxed">{item.notes}</p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="ppeoverview-heading" className="mb-10">
            <h2 id="ppeoverview-heading" className="text-2xl sm:text-3xl font-bold text-white mb-4">
              What the venue provides (PPE)
            </h2>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              All reputable UK rage rooms provide comprehensive PPE, which is mandatory for entry into the smash room:
            </p>
            <ul className="space-y-3 text-zinc-300">
              {[
                { item: "Full-body Tyvek-style coverall", note: "Worn over your clothes. Protects against glass shards, ceramic fragments and debris. Disposable or laundered between sessions." },
                { item: "Full-face visor helmet", note: "Protects your entire face and head — not just safety glasses. Essential and non-negotiable." },
                { item: "Heavy-duty gloves", note: "Leather or cut-resistant gloves that protect your hands from sharp edges and provide grip on tools." },
                { item: "Steel-toed boots (at most venues)", note: "Protect your feet from dropped items and impact. If the venue's range doesn't cover your size, bring your own sturdy closed-toe shoes." },
              ].map((item) => (
                <li key={item.item} className="flex gap-3">
                  <span className="text-orange-500 mt-1">✓</span>
                  <div>
                    <span className="text-white font-medium">{item.item}</span>
                    <p className="text-zinc-400 text-sm mt-0.5">{item.note}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="dont-wear-heading" className="mb-10">
            <h2 id="dont-wear-heading" className="text-2xl sm:text-3xl font-bold text-white mb-4">
              What not to wear
            </h2>
            <div className="space-y-3">
              {[
                { item: "Open-toed shoes, sandals or flip-flops", reason: "Always refused — a steel-toed boot is mandatory over open footwear." },
                { item: "High heels", reason: "Banned for safety — unstable on debris-covered floors." },
                { item: "Jewellery (rings, bracelets, necklaces, dangling earrings)", reason: "Must be removed before PPE fitting. Caught jewellery under a glove strap is the most common source of minor scrapes." },
                { item: "Watches", reason: "Remove these too — especially smart watches, which can be scratched by the helmet strap." },
                { item: "Very loose or flowy clothing", reason: "Doesn&apos;t affect safety much under coveralls, but can make PPE fitting awkward. Form-fitting clothes are more comfortable." },
                { item: "Smart or expensive clothing", reason: "Your clothes stay protected under coveralls, but you will sweat. Wear something you&apos;re happy to get damp." },
              ].map((item) => (
                <div key={item.item} className="flex gap-3 border-l-2 border-red-800/60 pl-4">
                  <div>
                    <span className="text-white font-medium">{item.item}</span>
                    <p
                      className="text-zinc-400 text-sm mt-0.5"
                      dangerouslySetInnerHTML={{ __html: item.reason }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="hair-heading" className="mb-10">
            <h2 id="hair-heading" className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Hair and helmet fitting
            </h2>
            <p className="text-zinc-300 mb-3 leading-relaxed">
              If you have long hair, tie it back before your session. A low ponytail or low bun works best — very high buns sit directly where the helmet liner rests and can make the helmet uncomfortable or difficult to secure properly.
            </p>
            <p className="text-zinc-300 leading-relaxed">
              The venue&apos;s staff will fit your helmet before you enter the smash room. If your helmet feels insecure or uncomfortable, say so — a properly fitted helmet is not just more comfortable, it&apos;s more protective. Don&apos;t enter the room with a helmet that doesn&apos;t feel right.
            </p>
          </section>

          <section aria-labelledby="what-to-bring-heading" className="mb-10">
            <h2 id="what-to-bring-heading" className="text-2xl sm:text-3xl font-bold text-white mb-4">
              What else to bring
            </h2>
            <ul className="space-y-2 text-zinc-300 list-disc list-inside ml-2">
              <li><strong className="text-white">Photo ID</strong> — most venues will ask to see ID for age verification (18+ standard).</li>
              <li><strong className="text-white">Spare top or change of clothes</strong> — optional, but nice to have for a session that runs 45–60 minutes.</li>
              <li><strong className="text-white">A water bottle</strong> — bring your own or check the venue has drinking water available. Physical smashing is thirsty work.</li>
              <li><strong className="text-white">Personal items to smash</strong> — if the venue allows it (check first), bring printed photos, old letters, unwanted items or small electronics (batteries removed) for a more personalised experience.</li>
              <li><strong className="text-white">A bag or locker items</strong> — most venues have lockers or a secure area for phones and valuables during the session. Phones aren&apos;t allowed inside the smash room.</li>
            </ul>
          </section>

          <div className="mb-10">
            <DigitalDownloadCTA variant="firstVisit" />
          </div>

          <section aria-labelledby="related-wear-heading" className="mb-10">
            <h2 id="related-wear-heading" className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Related guides
            </h2>
            <ul className="space-y-2 text-zinc-300">
              <li>
                <Link href="/guides/what-happens-in-a-rage-room" className="text-orange-500 hover:text-orange-400 underline">
                  What happens in a rage room? Step-by-step guide
                </Link>
              </li>
              <li>
                <Link href="/guides/are-rage-rooms-safe-uk" className="text-orange-500 hover:text-orange-400 underline">
                  Are rage rooms safe in the UK?
                </Link>
              </li>
              <li>
                <Link href="/guides/how-much-do-rage-rooms-cost-uk" className="text-orange-500 hover:text-orange-400 underline">
                  How much do rage rooms cost?
                </Link>
              </li>
              <li>
                <Link href="/guides/rage-room-near-me" className="text-orange-500 hover:text-orange-400 underline">
                  Find a rage room near me
                </Link>
              </li>
              <li>
                <Link href="/listings" className="text-orange-500 hover:text-orange-400 underline">
                  Browse UK rage rooms
                </Link>
              </li>
            </ul>
          </section>

          <FAQ items={FAQS.map((f) => ({ question: f.question, answer: f.answer }))} title="What to wear FAQs" />

          <div className="mt-10 text-center">
            <Link
              href="/listings"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-md transition-colors"
            >
              Find a Rage Room Near You
            </Link>
          </div>
        </article>
      </div>
    </div>
  )
}
